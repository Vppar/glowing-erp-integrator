'use strict';

var OrderService = {};
exports = module.exports = OrderService;

OrderService.create = function (billetRequestSnapshot, callback) {
	var err = '';

	if(err) {
		return callback(err, null);
  	}

  	callback(null, '[OrderService.create OK]'); 	
};