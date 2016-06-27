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

describe('getJsonWebToken', function(){
  it('AAD Server to Server Authentication', function(done){
    this.timeout(5000);

    var context = getResponseObject();
    context.done = function() {
        var response = this.res.body;
        response.should.not.be.empty;
        response.should.have.property('tokenType');
        done();
    }

    func(context);
  });
});