'use strict';

var async = require('async');

var EmailService = require('../services/EmailService');
var CustomerService = require('../services/CustomerService');
var OrderService = require('../services/OrderService');
var BilletService = require('../services/BilletService');
var SubscriptionService = require('../services/SubscriptionService');
var GlowingSubscriptionStatus = require('../enum/GlowingSubscriptionStatus');
var ProcessBilletsStatusController = {};

exports = module.exports = ProcessBilletsStatusController;


ProcessBilletsStatusController.handle = function (callback) {
	async.waterfall([      
      function(callback) {
        SubscriptionService.getSubscriptions(callback)
      },
      function(subscriptions, callback) {
        SubscriptionService.getPengingUserActionSubscriptions(subscriptions, callback)
      },
      function(pengingUserActionSubscriptions, callback) {
          for(var i = 0; i<pengingUserActionSubscriptions.length; i++) {
               var pengingUserActionSubscription = pengingUserActionSubscriptions[i];
               async.waterfall([
			        function(callback) {
			          BilletService.getBilletJSON(pengingUserActionSubscription, callback);
			        },
			        function(pengingUserActionSubscription, billet, callback) {  
			          BilletService.updateGlowingBilletStatus(pengingUserActionSubscription, billet, callback);
			        },       
			        function(pengingUserActionSubscription, callback) {  
			          BilletService.notifyPayedBilletToGlowingRestApi(pengingUserActionSubscription, callback);
			        },       
			        function(pengingUserActionSubscription, callback) { 
			          BilletService.markAsNotifiedToGlowing(pengingUserActionSubscription, callback);
			        },
			        function(pengingUserActionSubscription, callback) {
			          EmailService.sendApprovedPayment(pengingUserActionSubscription, callback);
			        },
			        function(pengingUserActionSubscription, callback) {
			          BilletService.updateGlowingSubscriptionStatus(pengingUserActionSubscription, callback);
			        }
		      ], function(err, result) {        
			        if(err) {          
			          console.log('[ProcessBilletsStatusController.handle.pengingUserActionSubscription][Errors: '+err+']');
			          hasError = true;          
			        } else {           
			          console.log('[ProcessBilletsStatusController.handle.pengingUserActionSubscription][Result: '+result+']');
			        }     
		      });          
          }
      }
  ], function(err, pengingUserActionSubscriptions) {
    if(err) {
      callback('[ProcessBilletsStatusController.handle][Flow executed with errors: '+ err+']', null);
    } else {
      console.log('[ProcessBilletsStatusController.handle][Flow executed successfully]');
      callback(null, pengingUserActionSubscriptions);  
    }     
  });

  callback();
};