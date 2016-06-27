var func = require('./index.js'),
    should = require('should'),
    uuid = require('uuid');

function getResponseObject() {
    return {
        res: null,
        log: function(message) {
            console.log(message);
        },
        done: null
    }
}

describe('Register new device', function(){
  it('Register new device', function(done){
    this.timeout(10000);

    var token = "p0n4xq5lKDdxITzeuW20e+AEKRIkZe9VoITbnvMw0DY=";
    var uniqueId = uuid.v1();
    var deviceId = "test-" + uniqueId;
    var req = {
        body: {
            deviceId: deviceId,
            token: token
        }
    }
    var context = getResponseObject();
    context.done = function() {
        context.res.status.should.equal(201);
        done();
    };

    func(context, req);
  });

  it('Register conflicted device', function(done){
    this.timeout(10000);

    var deviceId = "test-0e9ef240-3c65-11e6-9ec3-5d20955f7e1f";
    var token = "p0n4xq5lKDdxITzeuW20e+AEKRIkZe9VoITbnvMw0DY=";

    var req = {
        body: {
            deviceId: deviceId,
            token: token
        }
    }
    var context = getResponseObject();
    context.done = function() {
        this.res.status.should.equal(500);
        done();
    }

    func(context, req);
  });

  it('Register device with wrong authentication token', function(done){
    this.timeout(10000);

    var deviceId = "cbpi-xxx";
    var token = "token";

    var req = {
        body: {
            deviceId: deviceId,
            token: token
        }
    }
    var context = getResponseObject();
    context.done = function() {
        this.res.status.should.equal(500);
        done();
    }

    func(context, req);
  });

  it('Submits empty body', function(done){
    this.timeout(10000);

    var req = {};
    var context = getResponseObject();
    context.done = function() {
        this.res.status.should.equal(400);
        this.res.body.should.equal("NoBodyProvided");
        done();
    }

    func(context, req);
  });

  it('Submits body without deviceId', function(done){
    this.timeout(10000);

    var req = {
        body: {
            token: "token"
        }
    }
    var context = getResponseObject();
    context.done = function() {
        this.res.status.should.equal(400);
        this.res.body.should.equal("MissingDeviceId");
        done();
    }

    func(context, req);
  });

  it('Submits body without token', function(done){
    this.timeout(10000);

    var req = {
        body: {
            deviceId: "deviceId"
        }
    }
    var context = getResponseObject();
    context.done = function() {
        this.res.status.should.equal(400);
        this.res.body.should.equal("MissingAuthenticationToken");
        done();
    }

    func(context, req);
  });
});