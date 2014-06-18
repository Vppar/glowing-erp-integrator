'use strict';

var CustomerService = {};
exports = module.exports = CustomerService;

CustomerService.create = function (billetRequestSnapshot, callback) {

	//ERROR
 	callback('error');

 	//OK
 	callback(null, 'one');
};