# Scheduler

|                |                                                                           |
| -------------- | ------------------------------------------------------------------------- |
| Name           | Scheduler                                                                 |
| Version        | v1.0.0                                                                    |
| Dockerhub Link | [weevenetwork/scheduler](https://hub.docker.com/r/weevenetwork/scheduler) |
| Authors        | Mesud Pasic                                                               |

- [Scheduler](#scheduler)
  - [Description](#description)
  - [Features](#features)
  - [Environment Variables](#environment-variables)
    - [Module Specific](#module-specific)
    - [Set by the weeve Agent on the edge-node](#set-by-the-weeve-agent-on-the-edge-node)
  - [Dependencies](#dependencies)

## Description

Scheduler runs periodically and checks for each devices if command needs to be executed based on a timeframe.

## Features

- Parsing scheduled plans for devices to change temperature based on a timesheet

## Environment Variables

| Environment Variables | type | Description |
| --- | --- | --- |
| MONGO_DEVICE_ENDPOINT | string | Mongo API endpoint for fetching device list by location |
| LOCATION_ID | string | ID of location for specific building |
| COMMAND_NAME | string | Command name that will be passed to egress service for current device environment |
| TRANSLATION_SERVICE_URL | string | Translation service URL for trnaslating commands |
| MANUFACTURER_NAME | string | Manufacturer name of devices used with scheduler |
| MANUFACTURER_DEVICE_TYPE | string | Device type used with scheduler (vicki thermostat for example) |

### Module Specific

### Set by the weeve Agent on the edge-node

| Environment Variables | type   | Description               |
| --------------------- | ------ | ------------------------- |
| MODULE_NAME           | string | Name of the module        |
| INGRESS_HOST          | string | Host where app is running |
| INGRESS_PORT          | string | Port where app is running |

## Dependencies

```js
"dependencies": {
    "express": "^4.17.3",
    "express-winston": "^4.2.0",
    "node-fetch": "^2.6.1",
    "winston": "^3.6.0",
	  "piscina": "^3.2.0",
}
```
