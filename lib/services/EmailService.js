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
		var consultant = subscription['subscription-consultant-request-queue'].consultant;
		var billet = subscription.billet;
		
		FS.readFile( 'views/billetEmail.html', function (err, html) {
			if (err) {
				callback(err);
			}
			else {
				var email = {
					"content": html.toString().replace("{billetLink}", billet.link),
					"subject": "Assinatura VPink",
					"to": consultant.email,
					"toName": consultant.name,
				}
				
				EmailService.sendEmail(email, subscription, billet, function(err, data) {
					if(err) {
						console.log('[EmailService.sendBilletToCustomer][Error: '+err+']');
						callback(err);
					} else {
						console.log('[EmailService.sendBilletToCustomer][Result: Succefully executed]');
						callback(null, subscription, billet);
					}
				});
			}
		});	
	}
};

EmailService.isValidBillet = function(subscription) {
	return subscription &&  
		   subscription.billet &&
		   subscription.billet.link &&
		   subscription['subscription-consultant-request-queue'] &&
		   subscription['subscription-consultant-request-queue'].consultant.email && 
		   subscription['subscription-consultant-request-queue'].consultant.name;
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

EmailService.sendEmail = function(email, subscription, billet, callback) {
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
			callback(null, data);
		},
		function(err) {
			callback(err, null);
		}
	);
};
