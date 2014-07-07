'use strict';

var ArrayUtil = {};

exports = module.exports = ArrayUtil;

ArrayUtil.filter = function (subscriptionsObj, status, callback) {
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
		callback('[ArrayUtil.filter][No subscription to process]', null);
	}
};