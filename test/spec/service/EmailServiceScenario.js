'use strict';

var EmailService = require('../../../lib/services/EmailService');
var Config = require('../../../lib/Config');
var Mandrill = require('mandrill-api/mandrill');
//var assert = require("assert");
var sinon  = require('sinon');
var expect = require('chai').expect;
var should = require('chai').should();

var validSubscription;
var invalidSubscription;

describe('Service: EmailServiceScenario', function() {

	beforeEach(function() { 
		validSubscription = {"billet":{"link": "www.vpas.com.br/1"},
							 "snapshot":{"consultant":{"name": "Test VPink","email": "jarvis@tuntscorp.com"}}};
		invalidSubscription = {"billet":{"link": "www.vpas.com.br/1"}};
	});

	//TODO Should mock Mandrill external calls.
	xit('should send billet email. Valid Subscription', function(done) {
		EmailService.sendBilletToCustomer(validSubscription, function(err, success) {
			should.not.exist(err);
  			should.exist(success);
  			success.should.be.an('object');
  			done();
		});
	});

	it('should not send billet email. Invalid Subscription', function(done) {
		EmailService.sendBilletToCustomer(invalidSubscription, function(err, success) {
			should.not.exist(success);
	  		should.exist(err);
  			err.should.be.a('string'); 
  			done();
		});
	});

	//TODO Should mock Mandrill external calls.	
	xit('should send approved payment email. Valid Subscription. Billet is payed', function(done) {
		validSubscription.billet.status = 'PAYED';
		EmailService.sendApprovedPayment(validSubscription, function(err, success) {
			should.not.exist(err);
  			should.exist(success);
  			success.should.be.an('object');
  			done();
		});
	});

	it('should not send approved payment email. Valid Subscription. Billet is not payed', function(done) {
		EmailService.sendApprovedPayment(validSubscription, function(err, success) {
			should.not.exist(err);
  			should.exist(success);
  			success.should.be.an('object');
  			done();
		});
	});

	it('should not send approved payment email. Invalid Subscription', function(done) {
		EmailService.sendApprovedPayment(invalidSubscription, function(err, success) {
			should.not.exist(err);
  			should.exist(success);
  			success.should.be.an('object');
  			done();
		});
	});

});