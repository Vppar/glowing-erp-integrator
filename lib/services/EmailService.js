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
			
			FS.readFile( 'views/billetEmail.html', function (err, html) {
				if (err) {
					callback(err);
				}
				else {
					var email = {
						'content': html.toString().replace('{billetLink}', billet.link),
						'subject': 'Seu boleto para Assinatura VPink',
						'to': consultant.email,
						'toName': consultant.name,
					}
					
					EmailService.sendEmail(email, subscription, function(err, data) {
						if(err) {
							console.log('[EmailService.sendBilletToCustomer][Subscription: '+subscription.uuid+'][Error: '+err+']');
							callback(err);
						} else {							
							subscription.billet.status = GlowingBilletStatus.SENT;
							subscription.status = GlowingSubscriptionStatus.PENDING_USER_ACTION;
							
							console.log('[EmailService.sendBilletToCustomer][Subscription: '+subscription.uuid+'][Result: Succefully executed]');
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
			callback('[EmailService.sendApprovedPayment][Erro: invalid param]');
		} else {
			FS.readFile('views/approvedPaymentEmail.html', function (err, html) {
				if (err) {
					callback(err);
				}else {
					var email = {
						'content': html.toString(),
						'subject': 'Parabéns! Assinatura VPink Confirmada!',
						'to': subscription.snapshot.consultant.email,
						'toName': subscription.snapshot.consultant.name,
					}
					
					EmailService.sendEmail(email, subscription, function (err, data) {
						if(err) {
							callback(err);
						} else {
							console.log('Email enviado para '+ subscription.snapshot.consultant.email + ' com sucesso');
							
							callback(null, subscription);
						}
					});
				}
			});	
		}	
	} else {
		console.log('[EmailService.sendApprovedPayment][Subscription: '+subscription.uuid+'][Result: Not necessary send e-mail]');	
		callback(null, subscription);
	}
}

EmailService.sendEmail = function(email, subscription, callback) {
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
			console.log('[EmailService.sendEmail][Subscription: '+subscription.uuid+'][MessageRS: '+JSON.stringify(data)+']');	
			callback(null, data);
		},
		function(err) {
			console.log('[EmailService.sendEmail][Subscription: '+subscription.uuid+'][MessageRS: '+JSON.stringify(err)+']');	
			callback(err, null);
		}
	);
};
