const env = require('../utils/env')

module.exports = {
  INGRESS_HOST: env('INGRESS_HOST', '127.0.0.1'),
  INGRESS_PORT: env('INGRESS_PORT', '8080'),
  MODULE_NAME: env('MODULE_NAME', 'Scheduler'),
  MONGO_DEVICE_ENDPOINT: env('MONGO_DEVICE_ENDPOINT', 'https://api.wohnio.weeve.engineering/devices'),
  LOCATION_ID: env('LOCATION_ID', '6238a3c87d68b786d8024bf9'),
  MANUFACTURER_NAME: env('MANUFACTURER_NAME', 'mcclimate'),
  MANUFACTURER_DEVICE_TYPE: env('MANUFACTURER_DEVICE_TYPE', 'vickithermostat'),
  TRANSLATION_SERVICE_URL: env('TRANSLATION_SERVICE_URL', 'http://localhost:8082'),
  EGRESS_URL: env('EGRESS_URL', 'http://localhost:8083'),
  COMMAND_NAME: env('COMMAND_NAME', 'addDownlinkDeviceQueue'),
}
