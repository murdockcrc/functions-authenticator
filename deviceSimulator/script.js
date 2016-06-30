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

module.exports = (function() {    
    var context = getResponseObject();   
    context.done = function() {
        
    }
    var timeout = 0;
    for(i = 0; i < 1000; i++) {
        timeout += 500;
        setTimeout(function() {
            context.log('sending data');
            dataSimulator(context);
        }, timeout);        
    }    
})();        
