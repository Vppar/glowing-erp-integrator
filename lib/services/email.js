'use strict';

var EmailService = {};
exports = module.exports = EmailService;

EmailService.sendBilletToCustomer = function (billetRequestSnapshot, callback) {
	console.log('MODULO: '+'EmailService.sendBilletToCustomer');
	var err = '';

	if(err) {
		console.log('MODULO: '+'EmailService.sendBilletToCustomer err '+err);
		return callback(err, null);
  	}

  	callback(null, '[EmailService.sendBilletToCustomer OK]');
};