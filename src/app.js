const { INGRESS_HOST, INGRESS_PORT, MODULE_NAME, LOCATION_ID } = require('./config/config.js')
const express = require('express')
const app = express()
const winston = require('winston')
const expressWinston = require('express-winston')
const { getDevicesList, getLocations } = require('./utils/api')
const { formatTimeDiff } = require('./utils/util')
const Piscina = require('piscina')
const path = require('path')

// initialization
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// logger
app.use(
  expressWinston.logger({
    transports: [
      new winston.transports.Console(),
      /*
    new winston.transports.File({
        filename: 'logs/scheduler.log'
    })
    */
    ],
    format: winston.format.combine(winston.format.colorize(), winston.format.json()),
    meta: true, // optional: control whether you want to log the meta data about the request (default to true)
    msg: 'HTTP {{req.method}} {{req.url}}', // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
    expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
    colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
    ignoreRoute: function (req, res) {
      return false
    }, // optional: allows to skip some log messages based on request and/or response
  })
)
const startTime = Date.now()
// health check
app.get('/health', async (req, res) => {
  res.json({
    serverStatus: 'Running',
    uptime: formatTimeDiff(Date.now(), startTime),
    module: MODULE_NAME,
  })
})
// main post listener
app.post('/', async (req, res) => {
  let deviceList = []
  if (LOCATION_ID) {
    deviceList = await getDevicesList(LOCATION_ID)
  } else {
    const locations = await getLocations()
    if (locations) {
      for (let i = 0; i < locations.length; i++) {
        const d = await getDevicesList(locations[i])
        if (d) {
          deviceList.push(...d)
        }
      }
    }
  }
  if (deviceList == null) {
    return res.status(400).json({ status: false, message: 'Cannot fetch device list.' })
  }
  const piscina = new Piscina({
    filename: path.resolve(__dirname, 'worker.js'),
  })
  deviceList.forEach(device => {
    piscina.run(device)
  })
  return res.status(200).json({
    status: true,
    data: null,
    message: `${deviceList.length} devices sent for processing schedule plans`,
  })
})

// handle exceptions
app.use(async (err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }
  const errCode = err.status || 401
  res.status(errCode).send({
    status: false,
    message: err.message,
  })
})

if (require.main === module) {
  app.listen(INGRESS_PORT, INGRESS_HOST, () => {
    console.log(`${MODULE_NAME} listening on ${INGRESS_PORT}`)
  })
}
