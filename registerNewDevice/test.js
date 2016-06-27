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
    this.timeout(5000);

    var token = "CaIZWxaQdRBT09euPaaQBbbToEWfuv1Jj38QRxE3RYo=";
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
    this.timeout(5000);

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

  it('Register device with wrong authentication token', function(done){
    this.timeout(5000);

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
});