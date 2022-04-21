const env = require('../utils/env')

module.exports = {
  HOST_NAME: env('HOST_NAME', '127.0.0.1'),
  HOST_PORT: env('HOST_PORT', '8080'),
  MODULE_NAME: env('MODULE_NAME', 'Scheduler'),
  MELITA_API_URL: env('MELITA_API_URL', ''),
  ENCODER_SERVICE_URL: env('ENCODER_SERVICE_URL', ''),
  MONGO_DB_NAME: env('MONGO_DB_NAME', 'wohnio'),
  MONGO_DB_URL: env('MONGO_DB_URL', 'localhost:27017'),
  MONGO_DB_USERNAME: env('MONGO_DB_USERNAME', 'wohnio'),
  MONGO_DB_PASSWORD: env('MONGO_DB_PASSWORD', 'wohnio'),
  LOCATION_ID: env('LOCATION_ID', '6238a3c87d68b786d8024bf9'),
  TRANSLATION_SERVICE_URL: env('TRANSLATION_SERVICE_URL', 'http://localhost:8081'),
  MANUFACTURER_NAME: env('MANUFACTURER_NAME', 'mcclimate'),
  MANUFACTURER_DEVICE_TYPE: env('MANUFACTURER_DEVICE_TYPE', 'vickithermostat'),
}
