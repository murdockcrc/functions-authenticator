'use strict';

var iothub = require('azure-iothub');
var util = require('util');
var request = require('request');

var iotHubName = process.env.IOT_HUB_NAME || 'cbpi-prod.azure-devices.net';
var iotHubConnectionString = process.env.IOTHUB_CONNECTION_STRING || util.format('HostName=cbpi-prod.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=CaIZWxaQdRBT09euPaaQBbbToEWfuv1Jj38QRxE3RYo=');

function provisionDevice(deviceId, callback) { 
    console.log(deviceId);
    var registry = iothub.Registry.fromConnectionString(iotHubConnectionString);

    var device = new iothub.Device(null);
    device.deviceId = deviceId;
    
    registry.create(device, callback);
    //  {
    // if (err) {
    //     registry.get(device.deviceId, printDeviceInfo);
    // }
    // if (deviceInfo) {
    //     printDeviceInfo(err, deviceInfo, res)
    // }
    // });

    // function printDeviceInfo(err, deviceInfo, res) {
    //     if (deviceInfo) {
    //         console.log('Device id: ' + deviceInfo.deviceId);
    //         console.log('Device key: ' + deviceInfo.authentication.SymmetricKey.primaryKey);
    //         var response = {
    //             id: deviceInfo.deviceId,
    //             key: deviceInfo.authentication.SymmetricKey.primaryKey
    //         }
    //         httpResponse.json(response);
    //     }
    // }
}

module.exports = function (context, req) {
    var deviceId = req.params.deviceId;

    provisionDevice(deviceId, function(error, deviceInfo) {
        if (error) {
            context.res({
                status: 500,
                body: error
            })
        } else {
            context.res({
                status: 201,
                body: deviceInfo
            });
        }
        context.done();
    })
}

// module.exports.getConfiguration = function getConfiguration(req, res) {
//     var response = {
//         iotHubName: iotHubName
//     }
//     res.json(response);
// }