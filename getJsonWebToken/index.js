var AuthenticationContext = require('adal-node').AuthenticationContext,
    crypto = require('crypto');

var clientId = process.env.AAD_CLIENT_ID;
var clientSecret = process.env.AAD_CLIENT_SECRET;
var authorityHostUrl = 'https://login.windows.net';
var tenant = 'coditlab.onmicrosoft.com';
var authorityUrl = authorityHostUrl + '/' + tenant;
var redirectUri = 'https://cbpi-api-prod.azurewebsites.net/api/azureaadcallback';
var resource = '00000002-0000-0000-c000-000000000000';
var templateAuthzUrl = 'https://login.windows.net/' + 
                        tenant + 
                        '/oauth2/authorize?response_type=code&client_id=' +
                        clientId + 
                        '&redirect_uri=' + 
                        redirectUri + 
                        '&state=<state>&resource=' + 
                        resource;

function createAuthorizationUrl(state) {
  return templateAuthzUrl.replace('<state>', state);
}

function authenticate(context, req) {
    var authenticationContext = new AuthenticationContext(authorityUrl);

    authenticationContext.acquireTokenWithClientCredentials(resource, clientId, clientSecret, function(error, tokenResponse) {
        if (error) {
            var errorStatus = error.message.match(/error: (.*) and/)[1];
            var errorMessage = error.message.match(/response: (.*)"/)[1] + "\"}";
            var jsonError = JSON.parse(errorMessage);       
            context.res = {
                status: errorStatus,
                body: jsonError.error_description
            }
        } else {
            context.res = {
                status: 200,
                body: tokenResponse
            }
        }
        context.done();
    });
}

module.exports = authenticate;

// user pass Xubo0037
// aad app key: 
// aad client id: 