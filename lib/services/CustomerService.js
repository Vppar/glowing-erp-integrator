'use strict';

var CustomerService = {};
exports = module.exports = CustomerService;

CustomerService.create = function (subscriptionSnapshot, callback) {
	var err = '';

	if(err) {
		return callback(err, null);
  	}

  	callback(null, '[CustomerService.create OK]');
};