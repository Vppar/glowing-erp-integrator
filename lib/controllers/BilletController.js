'use strict';

var async = require('async');

var EmailService = require('../services/EmailService');
var CustomerService = require('../services/CustomerService');
var OrderService = require('../services/OrderService');

var BilletService = require('../services/BilletService');

var BilletController = {};

exports = module.exports = BilletController;

BilletController.handleBilletRequest = function (subscriptionSnapshot, callback) {
  console.log('[BilletRequestController.handleBillet][Starting service...]');
	async.series([
		  function(callback) {
    		BilletService.validateSubscriptionSnapshot(subscriptionSnapshot, callback)
  		},
  		function(callback) {
    		CustomerService.createNewCustomer(subscriptionSnapshot, callback)
  		},
  		function(callback) {
    		OrderService.create(subscriptionSnapshot, callback)
  		},
  		function(callback) {
    		BilletService.requestBilletGenerationToVPSA(subscriptionSnapshot, callback)
  		},
  		function(callback) {
    		BilletService.getBilletBytesFromVPSA(subscriptionSnapshot, callback)
  		},
  		function(callback) {
    		EmailService.sendBilletToCustomer(subscriptionSnapshot, callback)
  		}
	], function(err, results) {
		if(err) {
			callback('[BilletController.handleBillet][Billet Controller flow executed with errors: '+ err+']', null);
		} else {
			callback(null, '[BilletController.handleBillet][Billet Controller flow executed successfully: '+ results+']');	
		}  		
	});
};

BilletController.verifyBilletStatus = function (subscriptionSnapshot, callback) {
  BilletService.verifyBilletStatus(subscriptionSnapshot, function(err, results) {
        if(err) {
          callback(err, null);
        } else {
          callback(null, results);
        }
      }
  );
	BilletService.verifyBilletStatus(subscriptionSnapshot, callback);
};