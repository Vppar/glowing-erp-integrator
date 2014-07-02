'use strict';

var SubscriptionService = require('../services/SubscriptionService');
var SubscriptionController = {};

exports = module.exports = SubscriptionController;

var async = require('async');

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

SubscriptionController.getPengingUserActionSubscriptions = function (callback) {
  console.log('\n[SubscriptionController.handlePaymentStatusProcess][Starting service...]');

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
      console.log('[SubscriptionController.getPengingUserActionSubscriptions][Flow executed successfully: '+ JSON.stringify(pengingUserActionSubscriptions)+']');
      callback(null, pengingUserActionSubscriptions);  
    }     
  });
};