'use strict';

var iothub = require('azure-iothub');
var util = require('util');
var request = require('request');

var iotHubName = process.env.IOT_HUB_NAME || 'cbpi-prod.azure-devices.net';
var iotHubConnectionString;

function provisionDevice(deviceId, callback) { 
    var registry = iothub.Registry.fromConnectionString(iotHubConnectionString);

    var device = new iothub.Device(null);
    device.deviceId = deviceId;
    
    registry.create(device, callback);
}

function validateInput(deviceId, token) {
    var result = null;
    if(!deviceId) {
        result = {
            status: 400,
            body: "MissingDeviceId"
        };
    } else if(!token) {
        result = {
            status: 400,
            body: "MissingAuthenticationToken"
        }
    }
    return result;
}

module.exports = function (context, req) {
    var deviceId = req.body.deviceId,
        token = req.body.token;

    var isInputValid = validateInput(deviceId, token);
    if(isInputValid) {
        context.res = isInputValid;
        context.done();
    } else {
        iotHubConnectionString = process.env.IOTHUB_CONNECTION_STRING || util.format('HostName=cbpi-prod.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=%s', token);

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
}