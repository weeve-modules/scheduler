const env = require('../utils/env')

module.exports = {
  INGRESS_HOST: env('INGRESS_HOST', '127.0.0.1'),
  INGRESS_PORT: env('INGRESS_PORT', '8080'),
  MODULE_NAME: env('MODULE_NAME', 'Scheduler'),
  DB_REST_API: env('DB_REST_API', ''),
  LOCATION_ID: env('LOCATION_ID', ''),
  MANUFACTURER_NAME: env('MANUFACTURER_NAME', 'mcclimate'),
  MANUFACTURER_DEVICE_TYPE: env('MANUFACTURER_DEVICE_TYPE', 'vickithermostat'),
  TRANSLATION_SERVICE_URL: env('TRANSLATION_SERVICE_URL', ''),
  EGRESS_URL: env('EGRESS_URL', ''),
  COMMAND_NAME: env('COMMAND_NAME', 'addDownlinkDeviceQueue'),
}
