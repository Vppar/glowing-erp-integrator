'use strict';

var async = require('async');

var EmailService = require('../services/EmailService');
var CustomerService = require('../services/CustomerService');
var OrderService = require('../services/OrderService');
var BilletService = require('../services/BilletService');
var SubscriptionService = require('../services/SubscriptionService');
var BilletController = {};

exports = module.exports = BilletController;

BilletController.handleBillet = function (subscription, callback) {  
  console.log('\n[BilletController.handleBillet][Starting service...]');
	async.series([		  
  		function(callback) {
    		CustomerService.mergeCustomer(subscription.snapshot.consultant, callback);
  		},
  		function(callback) {
    		OrderService.create(subscription, callback);
  		},  		
  		function(callback) {
    		BilletService.createBillet(subscription, callback);
  		},
  		function(callback) {
  			BilletService.updateBillet(subscription, callback);
  		},
  		function(callback) {
  			EmailService.sendBilletToCustomer(subscription, callback);
  		},
  		function(callback) {
  			//SubscriptionService.updateStatus  (subscription, callback);
  		}


// Verificar o addup das datas

//0. Verificar todos os fluxos partindo do arquivo Workers.js
//1. Customer Stuffs
//2. Oreder Stuffs
//3. Criar o boleto no VPSA
//4. Atualizar no Firebse [ subscription.billet.link,  subscription.billet.status]
//5. Enviar o boleto para o usu�rio.
//6. Atualizar no Firebse [ subscription.status = PENDING_USER_ACTION]

//OBS.: Foram criados dois enums para o status do boleto e para o status da subscricao. Para os casos de falha
//dos itens acima, verificar quais status melhor caracterizam a situa��o do processo. Se houver uma falha de valida��o
//� importante marcar o subscription.status com SubscriptionStatus.FINISHED = 'FINISHED' e criar um subscription.erroMessage com a descricao do erro.
//OBS2: [ subscription.status = PENDING_USER_ACTION] � o disparo do processo pela crontab. A verifica��o de boletos
//ser� realizada somente nesse status.

	
	], function(err, result) {
		if(err) {
			//incluir erro status
			callback('[BilletController.handleBillet][Billet Controller flow executed with errors: '+ err+']', null);
		} else {
			callback(null, '[BilletController.handleBillet][Billet Controller flow executed successfully: '+ result+']');	

		}  		
	});
};

BilletController.handleBilletsPaymentStatusProcess = function (pengingUserActionSubscriptions, callback) {    
  console.log('[BilletController.handleBilletsPaymentStatusProcess][Starting service...]');   
  for (var i = 0; i < pengingUserActionSubscriptions.length; i++) {
       var subscription = pengingUserActionSubscriptions[i];
       async.waterfall([        
        function(callback) {
          BilletService.getBilletJSON(subscription, callback)
        },
        function(billet, callback) {
          BilletService.updateGlowingBilletStatus(subscription, billet, callback)
        },       
        function(subscription, billet, callback) {
          BilletService.notifyPayedBilletToGlowingRestApi(subscription, billet, callback)
        },
        function(subscription, billet, callback) {
          EmailService.sendBilletToCustomer(subscription, billet, callback)//TODO: trocar para EmailService.sendApprovedPayment
        },
        function(subscription, billet, callback) {
          BilletService.updateGlowingSubscriptionStatus(subscription, billet, callback)
        }
      ], function(err, result) {        
        if(err) {          
          console.log('[BilletController.handleBilletsPaymentStatusProcess][Errors: '+err+']');
        } else {
          callback(null, result); 
          console.log('[BilletController.handleBilletsPaymentStatusProcess][Result: Succefully executed]');
        }     
      }); 
  }
  callback();  
};