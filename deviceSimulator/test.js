var dataSimulator = require('./index.js'),
    util = require('util'),
    should = require('should');

function getResponseObject() {
    return {
        res: null,
        log: function(message) {
            console.log(util.format(arguments));
        },
        done: null
    }
}

describe('deviceSimulator', function(){    
    it('Generate random data', function(done){        
        var data = dataSimulator.dataSimulator();
        data.should.have.property('value_curent_a');
        data.should.have.property('value_energytotal_wh');
        data.should.have.property('value_power_w');        
        done();
    });

    it('Sends information to IoT Hub', function(done) {
        this.timeout(10000);
        var context = getResponseObject();   
        context.done = function() {
            should.not.exist(this.res);
            done();
        }     
        dataSimulator(context);        
    });
});