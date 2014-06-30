'use strict';

var Mandrill = require('mandrill-api/mandrill');
var FS = require('fs');
var config = require('../config');
var EmailService = {};

exports = module.exports = EmailService;

EmailService.sendBilletToCustomer = function(subscriptionSnapshot, callback) {
	
	if (!EmailService.isValidBillet(subscriptionSnapshot)) {
		callback('Invalid param');
	}
	else {
		FS.readFile( 'views/billetEmail.html', function (err, html) {
			if (err) {
				callback(err);
			}
			else {
				var email = {
					"content": html.toString().replace("{billetLink}",subscriptionSnapshot.billetLink),
					"subject": "Assinatura VPink",
					"to": subscriptionSnapshot.consultant.email,
					"toName": subscriptionSnapshot.consultant.name,
				}
				
				EmailService.sendEmail(email, callback);
			}
		});	
	}
};

EmailService.isValidBillet = function(billet) {
	return billet && billet.consultant && billet.consultant.email
			&& billet.consultant.name;
};

EmailService.sendApprovedPayment = function(subscriptionSnapshot, callback){
	if (!EmailService.isValidBillet(subscriptionSnapshot)) {
		callback('Invalid param');
	}
	else {
		FS.readFile( 'views/approvedPaymentEmail.html', function (err, html) {
			if (err) {
				callback(err);
			}
			else {
				var email = {
					"content": html.toString(),
					"subject": "Conta Aprovada",
					"to": subscriptionSnapshot.consultant.email,
					"toName": subscriptionSnapshot.consultant.name,
				}
				
				EmailService.sendEmail(email, callback);
			}
		});	
	}	
}

EmailService.sendEmail = function(email, callback) {
	var mandrillClient = new Mandrill.Mandrill(config.EMAIL_MANDRILL_KEY);

	var message = {
		"html" : email.content,
		"subject" : email.subject,
		"from_email" : config.EMAIL_FROM,
		"from_name" : config.EMAIL_NAME,
		"to" : [{
			"email" : email.to,
			"name" : email.toName,
			"type" : "to"
		}]
	};

	mandrillClient.messages.send({"message" : message,"async" : false}, 
		function(data) {
			callback(null, data);
		},
		function(err) {
			callback(err.name +' - '+ err.message);
		}
	);
};
