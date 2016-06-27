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

  it('Register conflicted device', function(done){
    this.timeout(5000);

    var deviceId = "cbpi-xxx";
    var req = {
        query: {
            deviceId: deviceId
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