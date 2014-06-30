'use strict';

var async = require('async');

var SubscriptionService = require('../services/SubscriptionService');
var SubscriptionController = {};

exports = module.exports = SubscriptionController;

SubscriptionController.handleSubscription = function (subscriptionSnapshot, callback) {  
  console.log('\n[SubscriptionController.handleSubscription][Starting service...]');
	async.series([
		  function(callback) {
    		SubscriptionService.save(subscriptionSnapshot, callback)
  		},
      function(callback) {
        SubscriptionService.validateSubscriptionSnapshot(subscriptionSnapshot, callback)
      }  		
	], function(err, results) {
		if(err) {
			callback('[SubscriptionController.handleSubscription][Subscription Controller flow executed with errors: '+ err+']', null);
		} else {
			callback(null, '[SubscriptionController.handleSubscription][Subscription Controller flow executed successfully: '+ results+']');	
		}  		
	});
};