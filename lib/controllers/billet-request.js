'use strict';

var async = require('async');
var EmailService = require('../services/email');
var CustomerService = require('../services/customer-request');
var OrderService = require('../services/order-request');
var BilletRequestService = require('../services/billet-request');
var BilletRequestController = {};

exports = module.exports = BilletRequestController;

BilletRequestController.handleBilletRequest = function (billetRequestSnapshot, callback) {
	async.series([
		  function(callback) {
    		BilletRequestService.validateBilletRequest(billetRequestSnapshot, callback)
  		},
  		function(callback) {
    		CustomerService.create(billetRequestSnapshot, callback)
  		},
  		function(callback) {
    		OrderService.create(billetRequestSnapshot, callback)
  		},
  		function(callback) {
    		BilletRequestService.requestBilletGenerationToVPSA(billetRequestSnapshot, callback)
  		},
  		function(callback) {
    		BilletRequestService.getBilletBytesFromVPSA(billetRequestSnapshot, callback)
  		},
  		function(callback) {
    		EmailService.sendBilletToCustomer(billetRequestSnapshot, callback)
  		}
	], function(err, results) {
		if(err) {
			callback('Error executing Billet Request flow: '+ err, null);
		} else {
			callback(null, 'Billet Request flow executed succefully: '+ results);	
		}  		
	});
};

BilletRequestController.verifyBilletStatus = function (billetRequestSnapshot, callback) {
  BilletRequestService.verifyBilletStatus(billetRequestSnapshot, function(err, results) {
        if(err) {
        callback(err, null);
      } else {
        callback(null, results);
      }
      }
  );
};