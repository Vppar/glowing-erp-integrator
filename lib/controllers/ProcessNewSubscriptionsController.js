'use strict';

var SubscriptionService = require('../services/SubscriptionService');
var BilletService = require('../services/BilletService');
var EmailService = require('../services/EmailService');
var CustomerService = require('../services/CustomerService');
var OrderService = require('../services/OrderService');
var GlowingSubscriptionStatus = require('../enum/GlowingSubscriptionStatus');
var GlowingPaymentType = require('../enum/GlowingPaymentType');
var ProcessNewSubscriptionsController = {};

exports = module.exports = ProcessNewSubscriptionsController;

var async = require('async');

ProcessNewSubscriptionsController.handle = function (subscription, callback) {  

  SubscriptionService.verifySubscriptionsAlreadyProcessed(subscription, function(err) {
    if(err) {
      callback(err, null);
    } else {
    	SubscriptionService.validateSubscriptionBeforeContinueFlow(subscription, function(err){
    		if(err){
    			SubscriptionService.pushSubscriptionFailMessage(subscription, err, function(errorCallback) {
    	            if(errorCallback) {
    	            	console.log('[ProcessNewSubscriptionsController.pushSubscriptionFailMessage][Error: '+errorCallback+']');
    	            } 
    	        });    			
    		} else {    				
	    		    var subscriptionToProcess = SubscriptionService.createSubscriptionInitialValues(subscription);	
	    	        if(GlowingPaymentType.PAYMENT_TYPE_BILLET === subscriptionToProcess.paymentType) {
						async.series([                 
		    	            function(callback) {
		    	              SubscriptionService.saveSubscription(subscriptionToProcess, callback);
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
		    	        ], function(err) {
			    	         	if(err) {
				    	          console.log('[ProcessNewSubscriptionsController.handle][Subscription: '+subscriptionToProcess.uuid+'][Error: '+err+']');
				    	          SubscriptionService.updateSubscriptionStatus(subscriptionToProcess.uuid, GlowingSubscriptionStatus.ERROR, err, function(errorCallback) {
				    	            if(errorCallback) {
				    	            	console.log('[ProcessNewSubscriptionsController.updateSubscriptionStatus][Subscription: '+subscriptionToProcess.uuid+'][Error: '+errorCallback+']');
				    	            } 
				    	          });       
			    	        	} else {
			    	        		console.log('[ProcessNewSubscriptionsController.handle][Subscription: '+subscriptionToProcess.uuid+'][Result: OK]');
			    	        	}   
	    	        		}
	    	        	);
	    	        } else {
	    	        	subscriptionToProcess.status = GlowingSubscriptionStatus.FINISHED;
	    	        	SubscriptionService.saveSubscription(subscriptionToProcess, callback);
	    	        } 		
    		}
    	});
    }
  });	
};