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

	  console.log('\n[ConsultantSubscriptionRequestWorker.verifyNewSubscriptions][Starting service...]'+subscriptionSnapshot);
		//if(err) {
			//console.log('\n[ConsultantSubscriptionRequestWorker.verifyNewSubscriptions][Error: '+err+']');
			//return;
		//}

		async.series([
			function(callback) {
	    		SubscriptionController.handleSubscription(subscriptionSnapshot, callback)
	  		},
	        function(callback) {
	        	BilletController.handleBillet(subscriptionSnapshot, callback)
	      	}  	
		], function(err, results) {
			if(err) {
				console.log('\n[ConsultantSubscriptionRequestWorker.verifyNewSubscriptions][Worker flow executed with errors: '+ err+']');
			} else {
				console.log(null, '\n[ConsultantSubscriptionRequestWorker.verifyNewSubscriptions][Worker flow executed successfully: '+ results+']');
			} 
			//This is where we actually process the data. We need to call "whenFinished" 
	        // when we're done to let the queue know we're ready to handle a new job.	         	
	        whenFinished(); 		
		}); 
	}

	new WorkQueue(consultantSubscriptionRequestQueueRef, workCallback);
};