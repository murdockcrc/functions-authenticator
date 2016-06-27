var func = require('./index.js'),
    should = require('should');

function getResponseObject() {
    return {
        res: null,
        log: function(message) {
            console.log(message);
        },
        done: null
    }
}

describe('getSASToken', function(){
  it('Gets SAS token', function(done){
    this.timeout(5000);

    var deviceId = "cbpi-xxx",
        token = "CFioZg5ajh6+qX1p1tZx4J4PsRKc5WdaCogVjSmSkVI=",
        req = {
            query: {
                deviceId: deviceId,
                token: token
        }
    }
    var context = getResponseObject();
    context.done = function() {
        this.res.status.should.equal(200);
        this.res.body.should.be.type('string');
        done();
    }

    func(context, req);
  });

  it('Tries to get SAS token without Device ID', function(done){
    this.timeout(5000);

    var deviceId = "cbpi-xxx",
        token = "CFioZg5ajh6+qX1p1tZx4J4PsRKc5WdaCogVjSmSkVI=",
        req = {
            query: {
                token: token
        }
    }
    var context = getResponseObject();
    context.done = function() {
        this.res.status.should.equal(400);
        this.res.body.should.equal('MissingDeviceId');
        done();
    }

    func(context, req);
  });

  it('Tries to get SAS token without token', function(done){
    this.timeout(5000);

    var deviceId = "cbpi-xxx",
        token = "CFioZg5ajh6+qX1p1tZx4J4PsRKc5WdaCogVjSmSkVI=",
        req = {
            query: {
                deviceId: deviceId,
        }
    }
    var context = getResponseObject();
    context.done = function() {
        this.res.status.should.equal(400);
        this.res.body.should.equal('MissingAuthenticationToken');
        done();
    }

    func(context, req);
  });

  it('Tries to get SAS token without query strings', function(done){
    this.timeout(5000);

    var deviceId = "cbpi-xxx",
        token = "CFioZg5ajh6+qX1p1tZx4J4PsRKc5WdaCogVjSmSkVI=",
        req = {
    }

    var context = getResponseObject();
    context.done = function() {
        this.res.status.should.equal(400);
        this.res.body.should.equal('NoBodyProvided');
        done();
    }

    func(context, req);
  });
});