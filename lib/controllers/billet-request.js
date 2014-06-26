'use strict';

var async = require('async');
var EmailService = require('../services/email');
var CustomerService = require('../services/customer-request');
var OrderService = require('../services/order-request');
var BilletRequestService = require('../services/billet-request');
var BilletRequestController = {};

exports = module.exports = BilletRequestController;

BilletRequestController.handleBilletRequest = function (subscriptionSnapshot, callback) {
  console.log('[BilletRequestController.handleBilletRequest][Starting service...]');
	async.series([
		  function(callback) {
    		BilletRequestService.validateSubscriptionSnapshot(subscriptionSnapshot, callback)
  		},
  		function(callback) {
    		CustomerService.create(subscriptionSnapshot, callback)
  		},
  		function(callback) {
    		OrderService.create(subscriptionSnapshot, callback)
  		},
  		function(callback) {
    		BilletRequestService.requestBilletGenerationToVPSA(subscriptionSnapshot, callback)
  		},
  		function(callback) {
    		BilletRequestService.getBilletBytesFromVPSA(subscriptionSnapshot, callback)
  		},
  		function(callback) {
    		EmailService.sendBilletToCustomer(subscriptionSnapshot, callback)
  		}
	], function(err, results) {
		if(err) {
			callback('[BilletRequestController.handleBilletRequest][Billet Request flow executed with errors: '+ err+']', null);
		} else {
			callback(null, '[BilletRequestController.handleBilletRequest][Billet Request flow executed successfully: '+ results+']');	
		}  		
	});
};

BilletRequestController.verifyBilletStatus = function (subscriptionSnapshot, callback) {
  BilletRequestService.verifyBilletStatus(subscriptionSnapshot, function(err, results) {
        if(err) {
        callback(err, null);
      } else {
        callback(null, results);
      }
      }
  );
};