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
    var username = "user1@coditlab.onmicrosoft.com",
        password = process.env.AAD_USER_PASSWORD;

    it('AAD user Authentication', function(done){
        this.timeout(5000);

        var req = {
            body: {
                username: username,
                password: password
            }
        }
        var context = getResponseObject();
        context.done = function() {
            var response = this.res.body;
            response.should.not.be.empty;
            response.should.have.property('tokenType');
            response.userId.should.equal(username);
            done();
        }

        func(context, req);
    });

    it('AAD user Authentication - wrong password', function(done){
        this.timeout(5000);

        var req = {
            body: {
                username: username,
                password: "password"
            }
        }
        var context = getResponseObject();
        context.done = function() {
            this.res.status.should.equal('400');            
            done();
        }

        func(context, req);
    });
});