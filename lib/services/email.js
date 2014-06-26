'use strict';

var mandrill = require('mandrill-api/mandrill');
var fs = require('fs');
var config = require('../config');

var EmailService = {};
exports = module.exports = EmailService;

EmailService.sendBilletToCustomer = function(billetRequestSnapshot, callback) {
	var mandrillClient = new mandrill.Mandrill(config.EMAIL_MANDRILL_KEY);

	if (!EmailService.isValid(billetRequestSnapshot)) {
		callback('Invalid param');
	}
	else {
		fs.readFile( 'views/billetEmail.html', function (err, html) {
			if (err) {
				callback(err);
			}
			else {
				var content = html.toString().replace(
					"{billetLink}", 
					billetRequestSnapshot.billetLink
				);
				
				var message = {
					"html" : content,
					"subject" : config.EMAIL_SUBJECT,
					"from_email" : config.EMAIL_FROM,
					"from_name" : config.EMAIL_NAME,
					"to" : [{
						"email" : billetRequestSnapshot.consultant.email,
						"name" : billetRequestSnapshot.consultant.name,
						"type" : "to"
					}]
				};

				mandrillClient.messages.send({"message" : message,"async" : false}, 
					function(result) {
						callback(null, result);
					},
					function(err) {
						callback(err.name +' - '+ err.message);
					}
				);
			}
		});	
	}
};

EmailService.isValid = function(bille) {
	return bille && bille.consultant && bille.consultant.email
			&& bille.consultant.name;
};