'use strict';

var EmailService = {};
exports = module.exports = EmailService;

EmailService.sendBilletToCustomer = function (billetRequestSnapshot, callback) {
 		//ERROR
 	callback('error');

 	//OK
 	callback(null, 'one');
};