'use strict';

var async = require('async');

var EmailService = require('../services/EmailService');
var CustomerService = require('../services/CustomerService');
var OrderService = require('../services/OrderService');
var BilletService = require('../services/BilletService');
var SubscriptionService = require('../services/SubscriptionService');
var BilletController = {};

exports = module.exports = BilletController;

BilletController.handleBillet = function (subscription, callback) {  
  console.log('\n[BilletController.handleBillet][Starting service...]');
	async.series([		  
  		function(callback) {
  			console.log('1');
    		CustomerService.mergeCustomer(subscription.snapshot.consultant, callback);
  		},
  		function(callback) {
  			console.log('2');
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
			//incluir erro status
			callback('[BilletController.handleBillet][Billet Controller flow executed with errors: '+ err+']', null);
		} else {
			callback(null, '[BilletController.handleBillet][Billet Controller flow executed successfully: '+ result+']');	
		}  		
	});
};

BilletController.handleBilletsPaymentStatusProcess = function (pengingUserActionSubscriptions, callback) {    
  console.log('[BilletController.handleBilletsPaymentStatusProcess][Starting service...]');   
  for (var i = 0; i < pengingUserActionSubscriptions.length; i++) {
       var subscription = pengingUserActionSubscriptions[i];
       async.waterfall([        
        function(callback) {
          BilletService.getBilletJSON(subscription, callback)
        },
        function(billet, callback) {
          BilletService.updateGlowingBilletStatus(subscription, billet, callback)
        },       
        function(subscription, billet, callback) {
          BilletService.notifyPayedBilletToGlowingRestApi(subscription, billet, callback)
        },
        function(subscription, billet, callback) {
          EmailService.sendBilletToCustomer(subscription, billet, callback)//TODO: trocar para EmailService.sendApprovedPayment
        },
        function(subscription, billet, callback) {
          BilletService.updateGlowingSubscriptionStatus(subscription, billet, callback)
        }
      ], function(err, result) {        
        if(err) {          
          console.log('[BilletController.handleBilletsPaymentStatusProcess][Errors: '+err+']');
        } else {
          callback(null, result); 
          console.log('[BilletController.handleBilletsPaymentStatusProcess][Result: Succefully executed]');
        }     
      }); 
  }
  callback();  
};