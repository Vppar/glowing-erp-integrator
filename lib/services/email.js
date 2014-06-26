'use strict';

var EmailService = {};
exports = module.exports = EmailService;

EmailService.sendBilletToCustomer = function (billetRequestSnapshot, callback) {
	var err = '';

	if(err) {
		return callback(err, null);
  	}

  	callback(null, '[EmailService.sendBilletToCustomer OK]');
};