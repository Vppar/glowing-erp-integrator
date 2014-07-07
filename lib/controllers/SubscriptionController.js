'use strict';

var SubscriptionService = require('../services/SubscriptionService');
var SubscriptionController = {};

exports = module.exports = SubscriptionController;

var async = require('async');

SubscriptionController.createSubscription = function ( subscriptionSnapshot ){
	return SubscriptionService.createSubscriptionInitialValues(subscriptionSnapshot);
}

SubscriptionController.handleSubscription = function (subscription, callback) {  
	async.series([
	function(callback) {
    	SubscriptionService.saveSubscription(subscription, callback)
  	},
    function(callback) {
        SubscriptionService.validateSubscription(subscription, callback)
      }  		
	], function(err, results) {
		if(err) {
			callback('[SubscriptionController.handleSubscription][Subscription Controller flow executed with errors: '+ err +']', null);
		} else {
			callback(null, '[SubscriptionController.handleSubscription][Subscription Controller flow executed successfully]');	
		}  		
	});
};

SubscriptionController.getPengingUserActionSubscriptions = function (callback) {
  async.waterfall([      
      function(callback) {
        SubscriptionService.getSubscriptions(callback)
      },
      function(subscriptions, callback) {
        SubscriptionService.getPengingUserActionSubscriptions(subscriptions, callback)
      }
  ], function(err, pengingUserActionSubscriptions) {
    if(err) {
      callback('[SubscriptionController.getPengingUserActionSubscriptions][Flow executed with errors: '+ err+']', null);
    } else {
      console.log('[SubscriptionController.getPengingUserActionSubscriptions][Flow executed successfully]');
      callback(null, pengingUserActionSubscriptions);  
    }     
  });
};