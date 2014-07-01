'use strict';

var async = require('async');

var EmailService = require('../services/EmailService');
var CustomerService = require('../services/CustomerService');
var OrderService = require('../services/OrderService');
var BilletService = require('../services/BilletService');
var BilletController = {};

exports = module.exports = BilletController;

BilletController.handleBillet = function (subscription, callback) {  
	console.log('\n[BilletController.handleBillet][Starting service...]');
	async.series([		  
  		function(callback) {
    		CustomerService.mergeCustomer(subscription.consultant, function(err, result){
    			if(err){
    				console.log(err);
    			}else{
    				console.log(result);
    			}
    		})
  		}
  		/*,
  		function(callback) {
    		OrderService.create(subscription, callback)
  		},
  		function(callback) {
    		BilletService.requestBilletGenerationToVPSA(subscription, callback)
  		},
  		function(callback) {
    		BilletService.getBilletBytesFromVPSA(subscription, callback)
  		},
  		function(callback) {
    		EmailService.sendBilletToCustomer(subscription, callback)
  		}*/
	], function(err, results) {
		if(err) {
			callback('[BilletController.handleBillet][Billet Controller flow executed with errors: '+ err+']');
		} else {
			callback(null, '[BilletController.handleBillet][Billet Controller flow executed successfully: '+ results+']');	
		}  		
	});
};

BilletController.verifyBilletsStatus = function (subscription, callback) {
	BilletService.verifyBilletsStatus(subscription, callback);
};