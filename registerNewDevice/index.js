'use strict';

var iothub = require('azure-iothub');
var util = require('util');
var request = require('request');

var iotHubName = process.env.IOT_HUB_NAME || 'cbpi-lab.azure-devices.net';
var iotHubConnectionString;

function provisionDevice(deviceId, callback) { 
    var registry = iothub.Registry.fromConnectionString(iotHubConnectionString);

    var device = new iothub.Device(null);
    device.deviceId = deviceId;
    
    registry.create(device, callback);
}

function validateInput(body) {
    var result = null;
    if(!body) {
        result = {
            status: 400,
            body: "NoBodyProvided"
        };
    } else if(!body.deviceId) {
        result = {
            status: 400,
            body: "MissingDeviceId"
        };
    } else if(!body.token) {
        result = {
            status: 400,
            body: "MissingAuthenticationToken"
        }
    }
    return result;
}

module.exports = function (context, req) {
    var isInputValid = validateInput(req.body);
    if(isInputValid) {
        context.res = isInputValid;
        context.done();
    } else {
        var deviceId = req.body.deviceId,
            token = req.body.token;        
        iotHubConnectionString = process.env.IOTHUB_CONNECTION_STRING || util.format('HostName=cbpi-lab.azure-devices.net;SharedAccessKeyName=registryReadWrite;SharedAccessKey=%s', token);

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