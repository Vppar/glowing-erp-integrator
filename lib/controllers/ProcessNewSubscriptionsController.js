'use strict';

var SubscriptionService = require('../services/SubscriptionService');
var BilletService = require('../services/BilletService');
var EmailService = require('../services/EmailService');
var CustomerService = require('../services/CustomerService');
var OrderService = require('../services/OrderService');
var ProcessNewSubscriptionsController = {};

exports = module.exports = ProcessNewSubscriptionsController;

var async = require('async');

ProcessNewSubscriptionsController.handle = function (subscriptionSnapshot, callback) {  

	var subscription = SubscriptionService.createSubscriptionInitialValues(JSON.parse(subscriptionSnapshot));

	async.series([
	  	function(callback) {
    	  SubscriptionService.saveSubscription(subscription, callback)
  	  },
      function(callback) {
        SubscriptionService.validateSubscription(subscription, callback)
      },
      function(callback) {
    		CustomerService.mergeCustomer(subscription, callback);
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
	], function(err, results) {
		if(err) {
			callback('[ProcessNewSubscriptionsController.handle][Flow executed with errors: '+ err +']', null);
		} else {
			callback(null, '[ProcessNewSubscriptionsController.handle][Flow executed successfully]');	
		}  		
	});
};