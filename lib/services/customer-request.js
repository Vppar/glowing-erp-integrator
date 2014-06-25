'use strict';

var CustomerService = {};
exports = module.exports = CustomerService;

CustomerService.create = function (billetRequestSnapshot, callback) {
	var err = '';

	if(err) {
		return callback(err, null);
  	}

  	callback(null, '[CustomerService.create OK]');
};