var EmailService = require('../../../lib/services/email');
var assert = require("assert");

describe('Service: EmailServiceScenario', function() {

	it('should send billet email', function(done) {
		var billetRequestSnapshot = {
			"billetLink": "vpink.vc",
			"consultant":{
				"name": "Test VPink",
				//"email": "jarvis@tuntscorp.com"
				"email": "rafael.andrade@tuntscorp.com"
			}
		};
		EmailService.sendBilletToCustomer(billetRequestSnapshot, function(error, sucess) {
			done();
			assert.equal(1, sucess.length);
			assert.equal('sent', sucess[0].status);
		});
	});

	it('should not send billet email', function(done) {
		var billetRequestSnapshot = {
			"consultant":{}
		};
		EmailService.sendBilletToCustomer(billetRequestSnapshot, function(error, sucess) {
			done();
			assert.equal('Invalid param', error);
		});
	});

	it('should send billet email', function(done) {
		var billetRequestSnapshot = {
			"consultant":{
				"name": "Test VPink",
				"email": "rafael.andrade@tuntscorp.com"
			}
		};
		EmailService.sendApprovedPayment(billetRequestSnapshot, function(error, sucess) {
			done();
			assert.equal(1, sucess.length);
			assert.equal('sent', sucess[0].status);
		});
	});

	it('should not send billet email', function(done) {
		var billetRequestSnapshot = {
			"consultant":{}
		};
		EmailService.sendApprovedPayment(billetRequestSnapshot, function(error, sucess) {
			done();
			assert.equal('Invalid param', error);
		});
	});

});