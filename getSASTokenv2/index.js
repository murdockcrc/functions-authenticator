var crypto = require('crypto');
var util = require('util');

var sbNamespace = process.env.SBNAMESPACE || 'cbpi-prod.azure-devices.net';

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

function validateInput(token, deviceId) {
    var errorMessage = null;
    if(!token) {
        errorMessage = "Error: missing token";
    } else if(!deviceId) {
        errorMessage = "Error: missing device ID"
    }
    if(errorMessage) {
        return {
            status: 400,
            body: errorMessage
        }
    }
    else {
        return null;
    }
}

module.exports = function(context, req) { 
    // for (var property in context.bindings) {
    //     context.log("Key: %s, Value: %s", property, context.bindings[property]);
    // }

    var token = req.query.token;
    var deviceId = req.query.deviceId;

    var isInputValid = validateInput(token, deviceId);
    if(isInputValid) {
        context.res(isInputValid);
    } else {
        var resourceUri = util.format('%s/devices/%s', sbNamespace, deviceId);

        var sasToken = generateSasToken(resourceUri, token, null, 14400);

        context.bindings.res({
            status: 200,
            body: sasToken
        });
    }
    context.done();
}