'use strict'
var util = require('util');

var Protocol = require('azure-iot-device-http').Http;
var Client = require('azure-iot-device').Client;
var ConnectionString = require('azure-iot-device').ConnectionString;
var Message = require('azure-iot-device').Message;

var deviceId = 'test-0d544dd0-3eaa-11e6-8205-6d1f96ea4efc';
var deviceKey = 'J6fRthDeEt3PnbfFzeihyINCY5eIVjUpSluUoV0tnF0=';

var data = {
    "timestamp": new Date().toUTCString(),
    "groupname":"Measurement",
    "value_voltage_v":224,
    "value_curent_a":0.3,
    "value_power_w":40,
    "value_energytotal_wh":63450
}

function randomSign() {
    var random = Math.random();
    if (random < 0.5) {
        return -1
    } else {
        return 1
    }
}

function dataManipulator() {
    var valueManipulators =  {
        voltage: randomSign() * Math.random() * (0.01 - 0) + 0,
        current: randomSign() * Math.random() * (0.05 - 0) + 0,
        energy: randomSign() * Math.random() * (0.1 - 0) + 0
    }
    var newData = data;
    newData.value_voltage_v = Math.floor(newData.value_voltage_v + (newData.value_voltage_v * valueManipulators.voltage));
    newData.value_curent_a = newData.value_curent_a + (newData.value_curent_a * valueManipulators.current);
    newData.value_energytotal_wh = Math.floor(newData.value_energytotal_wh + (newData.value_energytotal_wh * valueManipulators.energy));

    return newData;
}

var deviceMetaData = {
  'ObjectType': 'DeviceInfo',
  'IsSimulatedDevice': 0,
  'Version': '1.0',
  'DeviceProperties': {
    'DeviceID': deviceId,
    'HubEnabledState': 1,
    'CreatedTime': '2015-09-21T20:28:55.5448990Z',
    'DeviceState': 'normal',
    'UpdatedTime': null,
    'Manufacturer': 'Contoso Inc.',
    'ModelNumber': 'MD-909',
    'SerialNumber': 'SER9090',
    'FirmwareVersion': '1.10',
    'Platform': 'node.js',
    'Processor': 'ARM',
    'InstalledRAM': '64 MB',
    'Latitude': 47.617025,
    'Longitude': -122.191285
  }
};

// String containing Hostname, Device Id & Device Key in the following formats:
//  "HostName=<iothub_host_name>;DeviceId=<device_id>;SharedAccessKey=<device_key>"
var connectionString = util.format('HostName=cbpi-lab.azure-devices.net;DeviceId=%s;SharedAccessKey=%s', deviceId, deviceKey);
var deviceId = ConnectionString.parse(connectionString).DeviceId;

// Create IoT Hub client
var client = Client.fromConnectionString(connectionString, Protocol);

function main(context, req) {
    client.open(function (error, result) {
        if (error) {
            context.log(error);
        } else {
            context.log('Sending device metadata:\n' + JSON.stringify(deviceMetaData));
            client.sendEvent(new Message(JSON.stringify(data)), function(error, result) {
                if(error) {
                    context.log(error);
                    context.res = 'error';
                }
                context.done();
            });
        }
    });
}

module.exports = main;
module.exports.dataSimulator = dataManipulator;