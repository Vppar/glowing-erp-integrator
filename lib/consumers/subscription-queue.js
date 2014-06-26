'use strict';

var config = require('../config');
var FirebaseBackend = require('../backends/firebase');
var subscriptionQueueConsumerRef = FirebaseBackend.refs.base.child(config.subscription.consumer.child);
var BilletRequestController = require('../controllers/billet-request');

var SubscriptionQueue = {};
exports = module.exports = SubscriptionQueue;

SubscriptionQueue.consumer = function () {
	FirebaseBackend.on(config.subscription.consumer.eventType, subscriptionQueueConsumerRef, function(err, subscriptionSnapshot) {
		if(err) {
			console.log(err);
			return;
		}
		if(subscriptionSnapshot.paymentType === config.subscription.paymentType.billet) {
			BilletRequestController.handleBilletRequest(subscriptionSnapshot, function(err, results) {    	
		    	if(err) {
		    		console.log('[SubscriptionQueue.consumer][Error: '+err+']');
					return;
				} else {
					console.log('[SubscriptionQueue.consumer][Results: '+results+']');
				}
		    });
		}
		else {
			console.log('[SubscriptionQueue.consumer][Error: Payment type '+subscriptionSnapshot.paymentType+' not valid]');
		}	    
	});
};