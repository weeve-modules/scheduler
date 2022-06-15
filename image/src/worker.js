const fetch = require('node-fetch')
const {
  TRANSLATION_SERVICE_URL,
  MANUFACTURER_NAME,
  MANUFACTURER_DEVICE_TYPE,
  EGRESS_URL,
  COMMAND_NAME,
} = require('./config/config')

const translateCommand = async command => {
  let res = await fetch(TRANSLATION_SERVICE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      manufacturer: MANUFACTURER_NAME,
      device_type: MANUFACTURER_DEVICE_TYPE,
      command: command,
    }),
  })
  if (res.ok) {
    let json = await res.json()
    if (json.status) return json.data
    else return false
  } else return false
}

const sendCommand = async (deviceEUI, command) => {
  let payload = {
    command: {
      name: COMMAND_NAME,
      deviceEUI: deviceEUI,
      params: {
        confirmed: true,
        data: {
          command,
        },
        devEUI: deviceEUI,
        fPort: 1,
      },
    },
  }
  console.log(`Sending ${JSON.stringify(payload)} to ${EGRESS_URL}`);
  let res = await fetch(EGRESS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  if (res.ok) {
    let json = await res.json()
    return json.status
  } else return false
}

const isTimeReady = (start, end) => {
  start = start.toISOString().slice(11, 19)
  end = end.toISOString().slice(11, 19)
  var regExp = /(\d{1,2})\:(\d{1,2})\:(\d{1,2})/
  if (parseInt(end.replace(regExp, '$1$2$3')) >= parseInt(start.replace(regExp, '$1$2$3'))) return true
  else return false
}

module.exports = async device => {
  // check first for manualTemperature
  let manualSetup = false
  if (typeof device.manualTemperature.command !== 'undefined') {
    let until = new Date(device.manualTemperature.command.params.until)
    if (until > Date.now()) {
      manualSetup = true
      // execute it, this is missing from device JSON structure, need to inform thinkmoto
      console.log('Executing manual override')
      let command = device.manualTemperature.command
      delete command.params['until']
      let deviceCommand = await translateCommand(command)

      if (deviceCommand !== false) {
        // needs call to encoder
        let res = await sendCommand(device.EUI, deviceCommand.command)
        if (res === false) {
          console.log(`Failed sending command to device ${device.EUI}`)
        } else {
          console.log(
            `Command successfully sent to device ${device.EUI}, command ${JSON.stringify(deviceCommand.command)}`
          )
        }
      } else {
        console.log(`Failed translating command 'manualTemperature' for device ${device._id}`)
      }
    }
  }
  if (!manualSetup) {
    // go through the slots
    let day = new Date().getDay()
    let keys = Object.keys(device.schedule)
    //console.log(day)
    let callMade = false
    for (let k = 0; k < keys.length; k++) {
      let key = keys[k]
      //console.log(device.schedule[key].days);
      if (device.schedule[key].days.indexOf(day) != -1) {
        //console.log(device.schedule[key].slots);
        let slot_keys = Object.keys(device.schedule[key].slots)
        for (let i = 0; i < slot_keys.length; i++) {
          let slot = device.schedule[key].slots[slot_keys[i]]
          let untilDate = new Date(slot.time)
          //console.log(`slot time: ${untilDate}`);
          if (isTimeReady(new Date(), untilDate)) {
            let deviceCommand = await translateCommand(slot.command)
            console.log(
              `${device.EUI} has command ready ${JSON.stringify(
                deviceCommand
              )} for timeframe: ${untilDate.toTimeString()}`
            )
            if (deviceCommand !== false) {
              let res = await sendCommand(device.EUI, deviceCommand.command)
              if (res === false) {
                console.log(`Failed sending command to device ${device.EUI}`)
              } else {
                console.log(
                  `Command successfully sent to device ${device.EUI}, command ${JSON.stringify(deviceCommand.command)}`
                )
              }
            } else {
              console.log(`Failed translating command ${JSON.stringify(slot.command)} for device ${device.EUI}`)
            }
            //only first time scheduler that fits the time
            callMade = true
            break
          }
        }
      }
      if (callMade) break
    }
  }
  return true
}
