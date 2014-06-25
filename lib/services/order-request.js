'use strict';

var OrderService = {};
exports = module.exports = OrderService;

OrderService.create = function (billetRequestSnapshot, callback) {
	console.log('MODULO: '+'OrderService.create');
	var err = '';

	if(err) {
		console.log('MODULO: '+'OrderService.create err '+err);
		return callback(err, null);
  	}

  	callback(null, '[OrderService.create OK]'); 	
};