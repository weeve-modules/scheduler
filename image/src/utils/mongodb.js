const { MONGO_DB_URL, MONGO_DB_USERNAME, MONGO_DB_PASSWORD, LOCATION_ID, MONGO_DB_NAME } = require('../config/config')
const mongoose = require('mongoose')

mongoose.connect(
  `mongodb://localhost:27017/wohnio`, //mongodb://${MONGO_DB_USERNAME}:${MONGO_DB_PASSWORD}@${MONGO_DB_URL}/${MONGO_DB_NAME}
  { useNewUrlParser: true, useUnifiedTopology: true }
)
const connection = mongoose.connection

connection.on('error', console.error.bind(console, 'connection error:'))
connection.once('open', async () => {})

const getDevicesList = async () => {
  const collection = connection.db.collection('location')
  let r = await collection.find({ _id: new mongoose.Types.ObjectId(LOCATION_ID) }).toArray()
  let deviceList = []
  if (r.length) {
    if (r[0].sensors.length) {
      for (let i = 0; i < r[0].sensors.length; i++) {
        let d = await getDeviceById(r[0].sensors[i])
        if (d) deviceList.push(d)
      }
    }
  }
  return deviceList
}

const getDeviceById = async deviceId => {
  const collection = connection.db.collection('device')
  let r = await collection.find({ _id: new mongoose.Types.ObjectId(deviceId) }).toArray()
  if (r.length) return r[0]
  else return null
}

module.exports = {
  getDevicesList,
  getDeviceById,
}
