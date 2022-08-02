const fetch = require('node-fetch')
const {
  TRANSLATION_SERVICE_URL,
  MANUFACTURER_NAME,
  MANUFACTURER_DEVICE_TYPE,
  EGRESS_URLS,
  COMMAND_NAME,
} = require('./config/config')

const translateCommand = async command => {
  const res = await fetch(TRANSLATION_SERVICE_URL, {
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
    const json = await res.json()
    if (json.status) return json.data
    else return false
  } else return false
}

const sendCommand = async (deviceEUI, command) => {
  const payload = {
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
  const urls = []
  const eUrls = EGRESS_URLS.replace(/ /g, '')
  urls.push(...eUrls.split(','))
  urls.forEach(async url => {
    if (url) {
      try {
        const callRes = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        })
        if (!callRes.ok) {
          console.error(`Error passing response data to ${url}, status: ${callRes.status}`)
          return false
        } else {
          const json = await callRes.json()
          return json.status
        }
      } catch (e) {
        console.error(`Error making request to: ${url}, error: ${e.message}`)
        return false
      }
    }
  })
}

const isTimeReady = (start, end) => {
  start = start.toISOString().slice(11, 19)
  end = end.toISOString().slice(11, 19)
  const regExp = /(\d{1,2})\:(\d{1,2})\:(\d{1,2})/
  if (parseInt(end.replace(regExp, '$1$2$3')) >= parseInt(start.replace(regExp, '$1$2$3'))) return true
  else return false
}

module.exports = async device => {
  // check first for manualTemperature
  let manualSetup = false
  if (typeof device.manualTemperature.command !== 'undefined') {
    const until = new Date(device.manualTemperature.command.params.until)
    if (until > Date.now()) {
      manualSetup = true
      // execute it, this is missing from device JSON structure, need to inform thinkmoto
      console.log('Executing manual override')
      const command = device.manualTemperature.command
      delete command.params.until
      const deviceCommand = await translateCommand(command)

      if (deviceCommand !== false) {
        // needs call to encoder
        const res = await sendCommand(device.EUI, deviceCommand.command)
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
    const day = new Date().getDay()
    const keys = Object.keys(device.schedule)
    // console.log(day)
    let callMade = false
    for (let k = 0; k < keys.length; k++) {
      const key = keys[k]
      // console.log(device.schedule[key].days);
      if (device.schedule[key].days.indexOf(day) !== -1) {
        // console.log(device.schedule[key].slots);
        const slotKeys = Object.keys(device.schedule[key].slots)
        for (let i = 0; i < slotKeys.length; i++) {
          const slot = device.schedule[key].slots[slotKeys[i]]
          const untilDate = new Date(slot.time)
          // console.log(`slot time: ${untilDate}`);
          if (isTimeReady(new Date(), untilDate)) {
            const deviceCommand = await translateCommand(slot.command)
            console.log(
              `${device.EUI} has command ready ${JSON.stringify(
                deviceCommand
              )} for timeframe: ${untilDate.toTimeString()}`
            )
            if (deviceCommand !== false) {
              const res = await sendCommand(device.EUI, deviceCommand.command)
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
            // only first time scheduler that fits the time
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
