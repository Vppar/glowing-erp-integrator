'use strict';

var ArrayUtil = {};

exports = module.exports = ArrayUtil;

ArrayUtil.filterSubscriptionsByStatus = function (subscriptionsObj, status, callback) {
	
	var result = [];
	if(subscriptionsObj) {
		var keys = Object.keys(subscriptionsObj);
		for(var i = 0 ; i < keys.length; i++) {
			if (subscriptionsObj[keys[i]].status === status) {
				result.push(subscriptionsObj[keys[i]]);
			}		
		}
	}

	callback(result);
};

ArrayUtil.verifySubscriptionsAlreadyProcessed = function (subscriptionsObj, subscriptionUUID, callback) {
	var keys = Object.keys(subscriptionsObj);
	var result = [];

	for(var i = 0 ; i < keys.length; i++) {
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