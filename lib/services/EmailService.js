'use strict';

var Mandrill = require('mandrill-api/mandrill');
var GlowingSubscriptionStatus = require('../enum/GlowingSubscriptionStatus');
var GlowingBilletStatus = require('../enum/GlowingBilletStatus');
var FS = require('fs');
var Config = require('../Config');
var GlowingBilletStatus = require('../enum/GlowingBilletStatus');
var EmailService = {};

exports = module.exports = EmailService;

EmailService.sendBilletToCustomer = function(subscription, callback) {		
		if (!EmailService.isValidBillet(subscription)) {
			callback('[EmailService.sendBilletToCustomer][Error: Subscription has invalid parameters]');
		} else {
			var consultant = subscription.snapshot.consultant;
			var billet = subscription.billet;
			
			FS.readFile( 'views/billetEmail.html', function (err, html) {
				if (err) {
					callback(err);
				}
				else {
					var email = {
						'content': html.toString().replace('{billetLink}', billet.link),
						'subject': 'Assinatura VPink',
						'to': consultant.email,
						'toName': consultant.name,
					}
					
					EmailService.sendEmail(email, function(err, data) {
						if(err) {
							console.log('[EmailService.sendBilletToCustomer][Error: '+err+']');
							callback(err);
						} else {
							console.log('Email enviado com sucesso');
							
							subscription.billet.status = GlowingBilletStatus.SENT;
							subscription.status = GlowingSubscriptionStatus.PENDING_USER_ACTION;
							
							console.log('[EmailService.sendBilletToCustomer][Result: Succefully executed]');
							callback(null, subscription);	
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
		   subscription.snapshot &&
		   subscription.snapshot.consultant.email && 
		   subscription.snapshot.consultant.name;
};

EmailService.sendApprovedPayment = function(subscription, callback){
	if('PAYED' == subscription.billet.status) {
		if (!EmailService.isValidBillet(subscription)) {
			callback('Invalid param');
		}
		else {
			FS.readFile( 'views/approvedPaymentEmail.html', function (err, html) {
				if (err) {
					callback(err);
				}
				else {
					var email = {
						'content': html.toString(),
						'subject': 'Conta Aprovada',
						'to': subscription.snapshot.consultant.email,
						'toName': subscription.snapshot.consultant.name,
					}
					
					EmailService.sendEmail(email, function (err, data) {
						if(err) {
							callback(err);
						} else {
							callback(null, subscription);
						}
					});
				}
			});	
		}	
	} else {
		log('[BilletService.sendApprovedPayment][Error: Not necessary send e-mail]');	
		callback(null, subscription);
	}
}

EmailService.sendEmail = function(email, callback) {
	var mandrillClient = new Mandrill.Mandrill(Config.EMAIL_MANDRILL_KEY);

	var message = {
		'html' : email.content,
		'subject' : email.subject,
		'from_email' : Config.EMAIL_FROM,
		'from_name' : Config.EMAIL_NAME,
		'to' : [{
			'email' : email.to,
			'name' : email.toName,
			'type' : 'to'
		}]
	};

	mandrillClient.messages.send({'message' : message,'async' : false}, 
		function(data) {
			callback(null, data);
		},
		function(err) {
			callback(err, null);
		}
	);
};
