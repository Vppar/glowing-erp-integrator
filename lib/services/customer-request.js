'use strict';

var CustomerService = {};
exports = module.exports = CustomerService;

CustomerService.create = function (billetRequestSnapshot, callback) {
	console.log('MODULO: '+'CustomerService.create');
	var err = '';

	if(err) {
		console.log('MODULO: '+'CustomerService.create err '+err);
		return callback(err, null);
  	}

  	callback(null, '[CustomerService.create OK]');
};