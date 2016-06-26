var func = require('./index.js'),
    should = require('should');

describe('Register new device', function(){
  it('Register new device', function(done){
    this.timeout(3000);

    var deviceId = "cbpi-xxxx";
    var req = {
        query: {
            deviceId: deviceId
        }
    }

    func(
        {
            res: function(params) {
                console.log(params);
                params.status.should.equal(201);
                done();
            },
            log: function(message) {
                console.log(message);
            },
            done: function() { }
        }
    , req);
  });
});