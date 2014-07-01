'use strict';

var async = require('async');

var SubscriptionService = require('../services/SubscriptionService');
var SubscriptionController = {};

exports = module.exports = SubscriptionController;

SubscriptionController.handleSubscription = function (subscription, callback) {  
  console.log('\n[SubscriptionController.handleSubscription][Starting service...]');
	async.series([
	function(callback) {
    	SubscriptionService.createSubscriptionInitialValues(subscription, callback)
  	},
    function(callback) {
        SubscriptionService.validateSubscription(subscription, callback)
      }  		
	], function(err, results) {
		if(err) {
			callback('\n[SubscriptionController.handleSubscription][Subscription Controller flow executed with errors: '+ err+']', null);
		} else {
			callback(null, '[SubscriptionController.handleSubscription][Subscription Controller flow executed successfully: '+ results+']');	
		}  		
	});
};