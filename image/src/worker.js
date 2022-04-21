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
  if (device.manualTemperature) {
    let until = new Date(device.manualTemperature.until)
    if (until.getTime() >= Date.now()) {
      // execute it, this is missing from device JSON structure, need to inform thinkmoto
      let command = {
        name: 'setTemperatur',
        params: {
          value: device.manualTemperature.value,
        },
      }
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
    keys.forEach(key => {
      if (device.schedule[key].days.indexOf(day) != -1) {
        device.schedule[key].slots.forEach(async slot => {
          let fromDate = new Date(slot.time)
          if (fromDate >= Date.now()) {
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
          }
        })
      }
    })
  }
  return true
}
