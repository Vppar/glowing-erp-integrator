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

ProcessBilletsStatusController.getPengingUserActionSubscriptions = function (callback) {
	SubscriptionService.getPengingUserActionSubscriptions(function(err, pengingUserActionSubscriptions) {
		if(err) {
     		callback('[ProcessBilletsStatusController.getPengingUserActionSubscriptions][Flow executed with errors: '+ err+']', null);
	    } else {
	      	console.log('[ProcessBilletsStatusController.getPengingUserActionSubscriptions][Flow executed successfully]');
	      	callback(null, pengingUserActionSubscriptions);  
	    }  
	});
};

ProcessBilletsStatusController.handle = function (subscription, callback) {    
      async.waterfall([
        function(callback) {
          BilletService.getBilletJSON(subscription, callback)
        },
        function(subscription, billet, callback) {  
          BilletService.updateGlowingBilletStatus(subscription, billet, callback)
        },       
        function(subscription, callback) {  
          BilletService.notifyPayedBilletToGlowingRestApi(subscription, callback)
        },       
        function(subscription, callback) { 
          BilletService.markAsNotifiedToGlowing(subscription, callback)
        },
        function(subscription, callback) {
          EmailService.sendApprovedPayment(subscription, callback)
        },
        function(subscription, callback) {
          BilletService.updateGlowingSubscriptionStatus(subscription, callback)
        }
      ], function(err, result) {        
        if(err) {          
          console.log('[ProcessBilletsStatusController.handle][Errors: '+err+']');
        } else {           
          console.log('[ProcessBilletsStatusController.handle][Result: '+result+']');
        }     
      });
     callback();
}; 