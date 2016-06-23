var crypto = require('crypto');
var util = require('util');
var request = require('request');

var sbNamespace = process.env.SBNAMESPACE || 'cbpi-prod.azure-devices.net';
var sbEntityPath = process.env.SBENTITYPATH || 'cbpi-prod';
var sharedAccessKey = process.env.SENDERS_SHARED_ACCESS_KEY_1 || 'KsUrYkkTxq8GOI45/RntXenqo2+6VreIG/WBf3PBRJo='; 
var sharedAccessKeyName = process.env.SENDER_SHARED_ACCESS_NAME_1 || 'SendersPolicy';

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

module.exports.getSASToken = function getSASToken(req, res) { 
    var token = req.query.token;
    var deviceId = req.query.deviceId;
    var resourceUri = util.format('%s/devices/%s', sbNamespace, deviceId);

    var sasToken = generateSasToken(resourceUri, token, null, 14400);

    console.log(sasToken);
    res.send(sasToken);    
}