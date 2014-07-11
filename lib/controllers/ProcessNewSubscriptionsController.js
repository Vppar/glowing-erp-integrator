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
              BilletService.updateBillet(subscriptionToProcess, callback);
            },
            function(callback) {
              EmailService.sendBilletToCustomer(subscriptionToProcess, callback);
            },
            function(callback) {
              SubscriptionService.updateStatus(subscriptionToProcess, callback);
            }     
        ], function(err, results) {
          if(err) {
            callback('[ProcessNewSubscriptionsController.handle][Flow executed with errors: '+ err +']', null);
          } else {
            callback(null, '[ProcessNewSubscriptionsController.handle][Flow executed successfully]'); 
          }     
        });
    }
  });	
};