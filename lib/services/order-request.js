'use strict';

var OrderService = {};
exports = module.exports = OrderService;

OrderService.create = function (billetRequestSnapshot, callback) {
 	//ERROR
 	callback('error');

 	//OK
 	callback(null, 'one');
};