# Scheduler

|                |                            |
| -------------- | -------------------------- |
| Name           | Scheduler                  |
| Version        | v1.0.0                     |
| Dockerhub Link | [weevenetwork/scheduler]() |
| Authors        | Mesud Pasic                |

- [Scheduler](#scheduler)
  - [Description](#description)
  - [Features](#features)
  - [Environment Variables](#environment-variables)
    - [Module Specific](#module-specific)
    - [Set by the weeve Agent on the edge-node](#set-by-the-weeve-agent-on-the-edge-node)
  - [Dependencies](#dependencies)

## Description

Scheduler module.

## Features

- Parsing scheduled plans for devices to change temperature based on a timesheet

## Environment Variables

| Environment Variables | type | Description |
| --- | --- | --- |
| MONGO_DB_URL | string | MongoDB URL endpoint |
| MONGO_DB_NAME | string | MongoDB database name |
| MONGO_DB_USERNAME | string | MongoDB username |
| MONGO_DB_PASSWORD | string | MongoDB password |
| LOCATION_ID | string | ID of location for specific building |
| COMMAND_NAME | string | Command name that will be passed to egress service for current device environment |
| TRANSLATION_SERVICE_URL | string | Translation service URL for trnaslating commands |
| MANUFACTURER_NAME | string | Manufacturer name of devices used with scheduler |
| MANUFACTURER_DEVICE_TYPE | string | Device type used with scheduler (vicki thermostat for example) |


### Module Specific

### Set by the weeve Agent on the edge-node

| Environment Variables | type | Description |
| --- | --- | --- |
| MODULE_NAME | string | Name of the module |
| INGRESS_HOST | string | Host where app is running |
| INGRESS_PORT | string | Port where app is running |

## Dependencies

```js
"dependencies": {
    "body-parser": "^1.19.2",
    "express": "^4.17.3",
    "express-winston": "^4.2.0",
    "node-fetch": "^2.6.1",
    "winston": "^3.6.0",
	"piscina": "^3.2.0",
}
```
