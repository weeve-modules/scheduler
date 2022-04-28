const { isRedirect } = require('node-fetch')
const {
  TRANSLATION_SERVICE_URL,
  MANUFACTURER_NAME,
  MANUFACTURER_DEVICE_TYPE,
  MELITA_API_URL,
  ENCODER_SERVICE_URL,
} = require('./config/config')

const translateCommand = async command => {
  let res = await fetch(TRANSLATION_SERVICE_URL, {
    method: 'POST',
    body: JSON.stringify({
      manufacturer: MANUFACTURER_NAME,
      device_type: MANUFACTURER_DEVICE_TYPE,
      command,
    }),
  })
  if (res.ok) {
    let json = await res.json()
    return json.command
  } else return false
}

const sendCommand = async (deviceEUI, data) => {
  let payload = {
    data: {
      command: {
        name: 'addDownlinkDeviceQueue',
        deviceEUI: deviceEUI,
        params: {
          confirmed: true,
          data: data,
          devEUI: deviceEUI,
          fPort: 1,
        },
      },
    },
  }
  let res = await fetch(MELITA_API_URL, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  if (res.ok) {
    let json = await res.json()
    return json.status
  } else return false
}

const isTimeReady =(start,end)=>{
  start=start.toTimeString().slice(0,8);
  end=end.toTimeString().slice(0,8);
  var regExp = /(\d{1,2})\:(\d{1,2})\:(\d{1,2})/;
  if(parseInt(end.replace(regExp, "$1$2$3")) >= parseInt(start.replace(regExp, "$1$2$3")))
    return true;
  else
    return false;
}

const encodeCommand = async command => {
  let res = await fetch(ENCODER_SERVICE_URL, {
    method: 'POST',
    body: JSON.stringify({
      data: {
        command,
      },
    }),
  })
  if (res.ok) {
    let json = await res.json()
    return json.data
  } else return false
}
module.exports = async device => {
  // check first for manualTemperature
  if (typeof device.manualTemperature.command !=='undefined') {
    let until = new Date(device.manualTemperature.command.params.until)
    if (isTimeReady(Date.now(),until.getTime())) {
      // execute it, this is missing from device JSON structure, need to inform thinkmoto
      let command = device.manualTemperature.command;
      delete command.params['until'];
      let deviceCommand = await translateCommand(command)

      if (deviceCommand !== false) {
        // needs call to encoder
        let data = await encodeCommand(deviceCommand)
        if (data !== false) {
          let call = await sendCommand(device.EUI, data)
          if (!call.ok) {
            console.log(`Failed sending command to device device ${device._id}`)
          }
        } else {
          console.log(`Failed encoding command for device ${device._id}, command ${deviceCommand}`)
        }
      } else {
        console.log(`Failed translating command 'manualTemperature' for device ${device._id}`)
      }
    }
  } else {
    // go through the slots
    let day = new Date().getDay() - 1
    let keys = Object.keys(device.schedule)
    keys.forEach(async key => {
      if (device.schedule[key].days.indexOf(day) != -1) {
        let slot_keys = Object.keys(device.schedule[key].slots)
        for (let i = 0; i < slot_keys.length; i++) {
          let slot = device.schedule[key].slots[slot_keys[i]]
          let fromDate = new Date(slot.time)
          if (isTimeReady(Date.now(),fromDate.getTime())) {
            console.log(`${device.EUI} has command ready ${JSON.stringify(slot.command)} for timeframe: ${fromDate.toTimeString()}`);
            let deviceCommand = await translateCommand(slot.command)
            if (deviceCommand !== false) {
              // needs call to encoder
              let data = await encodeCommand(deviceCommand)
              if (data !== false) {
                let call = await sendCommand(device.EUI, data)
                if (!call.ok) {
                  console.log(`Failed sending command to device device ${device._id}`)
                }
              } else {
                console.log(`Failed encoding command for device ${device._id}, command ${deviceCommand}`)
              }
            } else {
              console.log(`Failed translating command 'manualTemperature' for device ${device._id}`)
            }
            //only first time scheduler that fits the time
            break
          }
        }
      }
    })
  }
  return true
}
