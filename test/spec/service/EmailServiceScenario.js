var EmailService = require('../../../lib/services/email');
var assert = require("assert");

describe('Service: EmailServiceScenario', function() {

	it('should send email', function(done) {
		var billetRequestSnapshot = {
			"billetLink": "vpink.vc",
			"consultant":{
				"name": "Test VPink",
				"email": "jarvis@tuntscorp.com"
			}
		};
		EmailService.sendBilletToCustomer(billetRequestSnapshot, function(error, sucess) {
			done();
			assert.equal(1, sucess.length);
			assert.equal('sent', sucess[0].status);
		});
	});

	it('should not send email', function(done) {
		var billetRequestSnapshot = {
			"consultant":{}
		};
		EmailService.sendBilletToCustomer(billetRequestSnapshot, function(error, sucess) {
			done();
			assert.equal('Invalid param', error);
		});
	});

});