'use strict';

var async = require('async');
var Config = require('../Config');
var FirebaseBackend = require('../backends/FirebaseBackend');
var BilletController = require('../controllers/BilletController');
var SubscriptionController = require('../controllers/SubscriptionController');
var WorkQueue = require("./WorkQueue.js");
var ConsultantSubscriptionRequestWorker = {};

exports = module.exports = ConsultantSubscriptionRequestWorker;

var consultantSubscriptionRequestQueueRef = FirebaseBackend.refs.base.child(Config.CONSULTANT_SUBSCRIPTION_REQUEST_QUEUE_REF);

ConsultantSubscriptionRequestWorker.verifyNewSubscriptions = function () {	

	var workCallback = function(subscriptionSnapshot, whenFinished) {
		console.log('[ConsultantSubscriptionRequestWorker.verifyNewSubscriptions][Starting service...]');

		var subscription = SubscriptionController.createSubscription( JSON.parse(subscriptionSnapshot) );	
		
		async.series([
			function(callback) {
	    		SubscriptionController.handleSubscription(subscription, callback)
	  		},
	        function(callback) {
	        	BilletController.handleBillet(subscription, callback)
	      	}  	
		], function(err, result) {
			if(err) {
				console.log('[ConsultantSubscriptionRequestWorker.verifyNewSubscriptions][Errors: ' + err + ']');
			} else {
				console.log('[ConsultantSubscriptionRequestWorker.verifyNewSubscriptions][Result: Successfully executed]');
			} 
			//This is where we actually process the data. We need to call "whenFinished" 
	        // when we're done to let the queue know we're ready to handle a new job.	         	
	        whenFinished(); 		
		}); 
	}

	new WorkQueue(consultantSubscriptionRequestQueueRef, workCallback);
};