'use strict';

var ArrayUtil = {};

exports = module.exports = ArrayUtil;

ArrayUtil.filterSubscriptionsByStatus = function (subscriptionsObj, status, callback) {
	var keys = Object.keys(subscriptionsObj);
	var result = [];

	for(var i = 0 ; i < keys.length ; i++) {
		if (subscriptionsObj[keys[i]].status === status) {
			result.push(subscriptionsObj[keys[i]]);
		}		
	}

	if(result.length > 0) {
		callback(null, result);
	} else {		
		callback('No PENDING_USER_ACTION subscriptions to process', null);
	}
};

ArrayUtil.verifySubscriptionsAlreadyProcessed = function (subscriptionsObj, subscriptionUUID, callback) {
	var keys = Object.keys(subscriptionsObj);
	var result = [];

	for(var i = 0 ; i < keys.length ; i++) {
		if (subscriptionsObj[keys[i]].snapshot.uuid === subscriptionUUID) {
			result.push(subscriptionsObj[keys[i]]);
		}		
	}

	if(result.length > 0) {
		callback('Subscription already been processed', null);
	} else {		
		callback();
	}
};