'use strict';

var async = require('async');

var EmailService = require('../services/EmailService');
var CustomerService = require('../services/CustomerService');
var OrderService = require('../services/OrderService');
var BilletService = require('../services/BilletService');
var SubscriptionService = require('../services/SubscriptionService');
var GlowingSubscriptionStatus = require('../enum/GlowingSubscriptionStatus');
var BilletController = {};

exports = module.exports = BilletController;

BilletController.handleBillet = function (subscription, callback) {  
	async.series([		  
  		function(callback) {
    		CustomerService.mergeCustomer(subscription.snapshot.consultant, callback);
  		},
  		function(callback) {
    		OrderService.create(subscription, callback);
  		},  		
  		function(callback) {
    		BilletService.createBillet(subscription, callback);
  		},
  		function(callback) {
  			BilletService.updateBillet(subscription, callback);
  		},
  		function(callback) {
  			EmailService.sendBilletToCustomer(subscription, callback);
  		},
  		function(callback) {
  			SubscriptionService.updateStatus(subscription, callback);
  		}
	], function(err, result) {
		if(err) {
 			subscription.status = GlowingSubscriptionStatus.ERROR;
			SubscriptionService.updateStatus(subscription, function(statusErr, statusResult){
				if(statusErr){
					console.log('[BilletController.handleBillet.updateStatus][Error: '+ statusErr +']');
				}
			});
      console.log('[BilletController.handleBillet][Error: '+ err +']');
			callback('[BilletController.handleBillet][Error: '+ err +']');
		} else {
			callback(null, '[BilletController.handleBillet][Result: '+ result +']');	
		}  		
	});
};

BilletController.handleBilletsPaymentStatusProcess = function (subscription, callback) {    
        var hasError = false;

        async.waterfall([
	        function(callback) {
	          BilletService.getBilletJSON(subscription, callback);
	        },
	        function(subscription, billet, callback) {  
	          BilletService.updateGlowingBilletStatus(subscription, billet, callback);
	        },       
	        function(subscription, callback) {  
	          BilletService.notifyPayedBilletToGlowingRestApi(subscription, callback);
	        },       
	        function(subscription, callback) { 
	          BilletService.markAsNotifiedToGlowing(subscription, callback);
	        },
	        function(subscription, callback) {
	          EmailService.sendApprovedPayment(subscription, callback);
	        },
	        function(subscription, callback) {
	          BilletService.updateGlowingSubscriptionStatus(subscription, callback);
	        }
      ], function(err, result) {        
	        if(err) {          
	          console.log('[BilletController.handleBilletsPaymentStatusProcess][Errors: '+err+']');
	          hasError = true;          
	        } else {           
	          console.log('[BilletController.handleBilletsPaymentStatusProcess][Result: '+result+']');
	        }     
      });

     callback();
}; 