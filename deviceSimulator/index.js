'use strict'
var util = require('util');

var Protocol = require('azure-iot-device-http').Http;
var Client = require('azure-iot-device').Client;
var ConnectionString = require('azure-iot-device').ConnectionString;
var Message = require('azure-iot-device').Message;
var config = require('../config.js');

var deviceId = 'cbpi-785b1db0-474d-11e6-8c6c-01e11fa91e59';
var deviceKey = 'UFKfUrT+HJMWs28hBku54zsBYlCak9xI8hRCo5v46H4=';

var data = {
    "timestamp": new Date().toUTCString(),
    "groupname":"Measurement",    
    "buildingId": 'VD-001',
    "value_voltage_v":224,
    "value_curent_a":0.3,
    "value_power_w":null,
    "value_energytotal_wh":63450
}
var temperatureData = {
    "GroupName":"Temperature",
    "Timestamp":new Date().toUTCString(),
    "Temp_Value":26.51
}

var potiData = {
    "GroupName":"ArrayPoti",
    "Timestamp":new Date().toUTCString(),
    "Poti_Value":[20581,3984]
}

var toiletData = {
    "GroupName":"Presence",
    "Timestamp":new Date().toUTCString(),
    "Input": false
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
    newData.value_power_w = newData.value_curent_a * newData.value_voltage_v;
    newData.timestamp = new Date().toUTCString();

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
var connectionString = util.format('HostName=%s;DeviceId=%s;SharedAccessKey=%s', config.IoTHub.name, deviceId, deviceKey);
var deviceId = ConnectionString.parse(connectionString).DeviceId;

// Create IoT Hub client
var client = Client.fromConnectionString(connectionString, Protocol);

function main(context, req) {
    var deviceData = dataManipulator();
    var message = new Message(JSON.stringify(deviceData));
    message.userId = deviceId;

    temperatureData.Temp_Value = temperatureData.Temp_Value + (randomSign() * 0.1 * temperatureData.Temp_Value);
    toiletData.Input = randomSign() == -1 ? false : true;

    var batchData = [
        message,
        new Message(JSON.stringify(temperatureData)),
        new Message(JSON.stringify(potiData)),
        new Message(JSON.stringify(toiletData))
    ];

    console.log(batchData);

    client.open(function (error, result) {
        if (error) {
            context.log(error);
        } else {            
            client.sendEventBatch(batchData, function(error, result) {                    
                if(error) {
                    context.log(error);
                    return;
                }
                context.done();                                       
            });                             
        }
    });
}

module.exports = main;
module.exports.dataSimulator = dataManipulator;