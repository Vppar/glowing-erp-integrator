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
			callback('[EmailService.sendBilletToCustomer][Subscription: '+subscription.uuid+'][Error: Subscription has invalid parameters]');
		} else {
			var consultant = subscription.snapshot.consultant;
			var billet = subscription.billet;
			
			FS.readFile( 'views/emailToInformBilletSent.html', function (err, html) {
				if (err) {
					callback(err);
				}
				else {
					var email = {
						'content': html.toString().replace('{billetLink}', billet.link),
						'subject': config.EMAIL_TO_INFORM_BILLET_SENT_SUBJECT,
						'to': consultant.email,
						'toName': consultant.name,
					}
					EmailService.sendEmail(email, subscription, GlowingBilletStatus.SENT, callback);
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

EmailService.sendApprovedPaymentNotification = function(subscription, callback){
	if('PAYED' === subscription.billet.status) {
		if (!EmailService.isValidBillet(subscription)) {
			callback('[EmailService.sendApprovedPaymentNotification][Erro: invalid param]');
		} else {
			FS.readFile('views/emailToInformApprovedPayment.html', function (err, html) {
				if (err) {
					callback(err);
				}else {
					var email = {
						'content': html.toString(),
						'subject': Config.EMAIL_TO_INFORM_APPROVED_PAYMENT_SUBJECT,
						'to': subscription.snapshot.consultant.email,
						'toName': subscription.snapshot.consultant.name,
					}					
					EmailService.sendEmail(email, subscription, null, callback);
				}
			});	
		}	
	} else {
		console.log('[EmailService.sendApprovedPaymentNotification][Subscription: '+subscription.uuid+'][Result: Not necessary send e-mail]');	
		callback(null, subscription);
	}
}

EmailService.sendEmail = function(email, subscription, glowingBilletStatus, callback) {
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

	console.log('[EmailService.sendEmail][Subscription: '+subscription.uuid+'][MessageRQ: '+JSON.stringify(message)+']');	

	mandrillClient.messages.send({'message' : message,'async' : false}, 
		function(data) {
			if(glowingBilletStatus) {
				subscription.billet.status = glowingBilletStatus;
			}			
			subscription.status = GlowingSubscriptionStatus.PENDING_USER_ACTION;
			console.log('[EmailService.sendEmail][Subscription: '+subscription.uuid+'][MessageRS: '+JSON.stringify(data)+']');	
			callback(null, subscription);
		},
		function(err) {
			console.log('[EmailService.sendEmail][Subscription: '+subscription.uuid+'][MessageRS: '+JSON.stringify(err)+']');	
			callback(err, null);
		}
	);
};
