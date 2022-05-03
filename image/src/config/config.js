const env = require('../utils/env')

module.exports = {
  INGRESS_HOST: env('INGRESS_HOST', '127.0.0.1'),
  INGRESS_PORT: env('INGRESS_PORT', '8080'),
  MODULE_NAME: env('MODULE_NAME', 'Scheduler'),
  MONGO_DB_NAME: env('MONGO_DB_NAME', 'wohnio'),
  MONGO_DB_URL: env('MONGO_DB_URL', 'localhost:27017'),
  MONGO_DB_USERNAME: env('MONGO_DB_USERNAME', 'wohnio'),
  MONGO_DB_PASSWORD: env('MONGO_DB_PASSWORD', 'wohnio'),
  LOCATION_ID: env('LOCATION_ID', '6238a3c87d68b786d8024bf9'),
  MANUFACTURER_NAME: env('MANUFACTURER_NAME', 'mcclimate'),
  MANUFACTURER_DEVICE_TYPE: env('MANUFACTURER_DEVICE_TYPE', 'vickithermostat'),
  TRANSLATION_SERVICE_URL: env('TRANSLATION_SERVICE_URL', 'http://localhost:8081'),
  EGRESS_URL: env('EGRESS_URL', 'http://localhost:8082'),
  COMMAND_NAME: env('COMMAND_NAME', 'addDownlinkDeviceQueue'),
}
