'use strict';

var async = require('async');

var EmailService = require('../services/EmailService');
var BilletService = require('../services/BilletService');
var SubscriptionService = require('../services/SubscriptionService');
var GlowingSubscriptionStatus = require('../enum/GlowingSubscriptionStatus');
var ProcessBilletsStatusController = {};

exports = module.exports = ProcessBilletsStatusController;

ProcessBilletsStatusController.getPengingUserActionSubscriptions = function (callback) {
	SubscriptionService.getPengingUserActionSubscriptions(callback);
};

ProcessBilletsStatusController.handle = function (subscription, callback) {
      async.waterfall([
        function(callback) {
          BilletService.getBilletJSON(subscription, callback);
        },
        function(subscription, billet, callback) {  
          BilletService.updateBilletStatusByVPSABillet(subscription, billet, callback);
        },       
        function(subscription, callback) {  
          BilletService.notifyPayedBilletToGlowingRestApi(subscription, callback);
        },
        function(subscription, callback) {
          SubscriptionService.updateSubscriptionStatusToPayedNotified(subscription, callback);
        },
        function(subscription, callback) {
          EmailService.sendApprovedPaymentNotification(subscription, callback);
        },
        function(subscription, callback) {
          SubscriptionService.updateSubscriptionStatusToFinished(subscription, callback);
        }
      ], function(err) {
        if(err) {
          console.log('[ProcessBilletsStatusController.handle][Subscription: '+subscription.uuid+'][Error: '+err+']');
          SubscriptionService.updateSubscriptionStatus(subscription.uuid, GlowingSubscriptionStatus.ERROR, err, function(errorCallback) {
            if(errorCallback) {
              console.log('[ProcessBilletsStatusController.updateSubscriptionStatus][Subscription: '+subscription.uuid+'][Error: '+errorCallback+']');
            } 
          });       
        } else {
          console.log('[ProcessBilletsStatusController.handle][Subscription: '+subscription.uuid+'][Result: OK]');
        }     
      });
     callback();
}; 