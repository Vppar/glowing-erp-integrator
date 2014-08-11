'use strict';

var ProcessNewSubscriptionsController = require('../controllers/ProcessNewSubscriptionsController');
var WorkQueue = require('../utils/WorkQueue.js');
var Config = require('../Config');
var FirebaseBackend = require('../backends/FirebaseBackend');
var ProcessNewSubscriptionsWorker = {};

exports = module.exports = ProcessNewSubscriptionsWorker;

ProcessNewSubscriptionsWorker.handle = function () {

	var workCallback = function(subscriptionSnapshot, whenFinished) {		

		ProcessNewSubscriptionsController.handle(subscriptionSnapshot, function(err) {
			if(err) {
				console.log('[ProcessNewSubscriptionsWorker.handle][Errors: ' + err + ']');
			} else {
				console.log('[ProcessNewSubscriptionsWorker.handle][Result: Successfully executed]');
			}
		});

		whenFinished();	
	};

	new WorkQueue(FirebaseBackend.refs.base.child(Config.CONSULTANT_SUBSCRIPTION_REQUEST_QUEUE_REF), workCallback);
};