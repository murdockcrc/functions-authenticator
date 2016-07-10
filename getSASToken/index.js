var crypto = require('crypto');
var util = require('util');
var config = require('../config.js');

var sbNamespace = process.env.SBNAMESPACE || config.IoTHub.name;

var generateSasToken = function(resourceUri, signingKey, policyName, expiresInMins) {
    resourceUri = encodeURIComponent(resourceUri.toLowerCase()).toLowerCase();

    // Set expiration in seconds
    var expires = (Date.now() / 1000) + expiresInMins * 60;
    expires = Math.ceil(expires);
    var toSign = resourceUri + '\n' + expires;

    // using crypto
    var decodedPassword = new Buffer(signingKey, 'base64').toString('binary');
    const hmac = crypto.createHmac('sha256', decodedPassword);
    hmac.update(toSign);
    var base64signature = hmac.digest('base64');
    var base64UriEncoded = encodeURIComponent(base64signature);

    // construct autorization string
    var token = "SharedAccessSignature sr=" + resourceUri + "&sig="
    + base64UriEncoded + "&se=" + expires;
    if (policyName) token += "&skn="+policyName;
    // console.log("signature:" + token);
    return token;
};

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

module.exports = function(context, req) { 
    var isInputValid = validateInput(req.query);    
    if(isInputValid) {
        context.res = isInputValid;
        context.done();
    } else {
        var token = req.query.token;
        var deviceId = req.query.deviceId;
        var resourceUri = util.format('%s/devices/%s', sbNamespace, deviceId);

        var sasToken = generateSasToken(resourceUri, token, null, 14400);
        context.res = {
            status: 200,
            body: sasToken
        }
        context.done();
    }
}