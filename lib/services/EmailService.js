'use strict';

var Mandrill = require('mandrill-api/mandrill');
var FS = require('fs');
var Config = require('../Config');
var EmailService = {};

exports = module.exports = EmailService;

EmailService.sendBilletToCustomer = function(subscription, billet, callback) {
	
	if (!EmailService.isValidBillet(subscription)) {
		callback('[EmailService.sendBilletToCustomer][Error: Subscription has invalid parameters]');
	}
	else {
		FS.readFile( 'views/billetEmail.html', function (err, html) {
			if (err) {
				callback(err);
			}
			else {
				var email = {
					"content": html.toString().replace("{billetLink}",subscription.billetLink),
					"subject": "Assinatura VPink",
					"to": subscription.consultant.email,
					"toName": subscription.consultant.name,
				}
				
				EmailService.sendEmail(billet, email, callback);
			}
		});	
	}
};

EmailService.isValidBillet = function(billet) {
	return subscription && subscription.consultant && subscription.consultant.email && subscription.consultant.name;
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

EmailService.sendEmail = function(billet, email, callback) {
	var mandrillClient = new Mandrill.Mandrill(Config.EMAIL_MANDRILL_KEY);

	var message = {
		"html" : email.content,
		"subject" : email.subject,
		"from_email" : Config.EMAIL_FROM,
		"from_name" : Config.EMAIL_NAME,
		"to" : [{
			"email" : email.to,
			"name" : email.toName,
			"type" : "to"
		}]
	};

	mandrillClient.messages.send({"message" : message,"async" : false}, 
		function(data) {
			callback(null, data, billet);
		},
		function(err) {
			callback(err.name +' - '+ err.message);
		}
	);
};
