'use strict';

var async = require('async');
var EmailService = require('../services/email');
var CustomerService = require('../services/customer-request');
var OrderService = require('../services/order-request');
var BilletRequestService = require('../services/billet-request');
var BilletRequestController = {};

exports = module.exports = BilletRequestController;

BilletRequestController.handleBilletRequest = function (billetRequestSnapshot, callback) {
  console.log('MODULO: '+'BilletRequestController.handleBilletRequest');
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
    console.log('MODULO: '+'BilletRequestController.handleBilletRequest.final callback');
		if(err) {
      console.log('MODULO: '+'BilletRequestController.handleBilletRequest.final callback err '+err);
			callback('Error executing Billet Request flow: '+ err, null);
		} else {
      console.log('MODULO: '+'BilletRequestController.handleBilletRequest.final callback success');
			callback(null, 'Billet Request flow executed succefully: '+ results);	
		}  		
	});
};