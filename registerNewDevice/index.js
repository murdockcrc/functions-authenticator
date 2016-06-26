'use strict';

var iothub = require('azure-iothub');
var util = require('util');
var request = require('request');

var iotHubName = process.env.IOT_HUB_NAME || 'cbpi-prod.azure-devices.net';
var iotHubConnectionString = process.env.IOTHUB_CONNECTION_STRING || util.format('HostName=cbpi-prod.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=CaIZWxaQdRBT09euPaaQBbbToEWfuv1Jj38QRxE3RYo=');

function provisionDevice(deviceId, callback) { 
    var registry = iothub.Registry.fromConnectionString(iotHubConnectionString);

    var device = new iothub.Device(null);
    device.deviceId = deviceId;
    
    registry.create(device, callback);
}

module.exports = function (context, req) {
    var deviceId = req.query.deviceId;

    provisionDevice(deviceId, function(error, deviceInfo) {
        if (error) {
            context.res = {
                status: 500,
                body: "An error was received from the backend when trying to register the device"
            };
        } else {
            context.res = {
                status: 201,
                body: deviceInfo
            };
        }
        context.done();
    });
}