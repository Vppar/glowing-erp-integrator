'use strict';

var SubscriptionService = require('../services/SubscriptionService');
var BilletService = require('../services/BilletService');
var EmailService = require('../services/EmailService');
var CustomerService = require('../services/CustomerService');
var OrderService = require('../services/OrderService');
var ProcessNewSubscriptionsController = {};

exports = module.exports = ProcessNewSubscriptionsController;

var async = require('async');

ProcessNewSubscriptionsController.handle = function (subscription, callback) {  

  SubscriptionService.verifySubscriptionsAlreadyProcessed(subscription, function(err) {
    if(err) {
      callback(err, null);
    } else {
        var subscriptionToProcess = SubscriptionService.createSubscriptionInitialValues(subscription);

        async.series([
            function(callback) {
              SubscriptionService.saveSubscription(subscriptionToProcess, callback)
            },
            function(callback) {
              CustomerService.mergeCustomer(subscriptionToProcess, callback);
            },
            function(callback) {
              OrderService.create(subscriptionToProcess, callback);
            },      
            function(callback) {
              BilletService.createBillet(subscriptionToProcess, callback);
            },
            function(callback) {
              BilletService.updateBilletValues(subscriptionToProcess, callback);
            },
            function(callback) {
              EmailService.sendBilletToCustomer(subscriptionToProcess, callback);
            },
            function(callback) {
              BilletService.updateBilletStatus(subscriptionToProcess.uuid, subscriptionToProcess.billet.status, callback);
            },
            function(callback) {
              SubscriptionService.updateSubscriptionStatus(subscriptionToProcess.uuid, subscriptionToProcess.status, null, callback);
            }      
        ], function(err, results) {
          if(err) {
            SubscriptionService.updateSubscriptionStatus(subscription.uuid, GlowingSubscriptionStatus.ERROR, err, function(err) {
              if(err) {
                console.log('[ProcessNewSubscriptionsController.updateSubscriptionStatus][Subscription: '+subscription.uuid+'][Status: '+GlowingSubscriptionStatus.ERROR+'][Errors: '+err+']');
              } else {
                console.log('[ProcessNewSubscriptionsController.updateSubscriptionStatus][Subscription: '+subscription.uuid+'][Status: '+GlowingSubscriptionStatus.ERROR+'][Result: '+result+']');
              }
            });          
          } else {
            console.log('[ProcessNewSubscriptionsController.handle][Subscription: '+subscription.uuid+'][Result: '+result+']');
          }    
        });
    }
  });	
};