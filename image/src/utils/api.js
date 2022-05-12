const { LOCATION_ID, MONGO_DEVICE_ENDPOINT } = require('../config/config')
const fetch = require('node-fetch')

const getDevicesList = async () => {
  const res = await fetch(MONGO_DEVICE_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      location: LOCATION_ID,
    }),
  })
  if (res.ok) {
    let json = await res.json()
    return json.data
  } else {
    return null
  }
}

module.exports = {
  getDevicesList,
}
