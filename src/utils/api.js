const { LOCATION_ID, DB_REST_API } = require('../config/config')
const fetch = require('node-fetch')

const getDevicesList = async locationId => {
  const res = await fetch(`${DB_REST_API}/devices/${locationId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  if (res.ok) {
    let json = await res.json()
    if (json.status) return json.data
    else return null
  } else {
    return null
  }
}

const getLocations = async () => {
  const res = await fetch(`${DB_REST_API}/locations`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  if (res.ok) {
    let json = await res.json()
    if (json.status) return json.data
    else return null
  } else {
    return null
  }
}

module.exports = {
  getDevicesList,
  getLocations,
}
