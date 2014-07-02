'use strict';

var async = require('async');

var EmailService = require('../services/EmailService');
var CustomerService = require('../services/CustomerService');
var OrderService = require('../services/OrderService');
var BilletService = require('../services/BilletService');
var BilletController = {};

exports = module.exports = BilletController;

BilletController.handleBillet = function (subscription, callback) {  
  console.log('\n[BilletController.handleBillet][Starting service...]');
	async.series([		  
  		function(callback) {
    		CustomerService.mergeCustomer(subscription.consultant, callback);
  		},
  		function(callback) {
    		OrderService.create(subscription, callback)
  		},  		
  		function(callback) {
    		BilletService.createBillet(subscription, callback)
  		}

// Verificar o addup das datas

//0. Verificar todos os fluxos partindo do arquivo Workers.js
//1. Customer Stuffs
//2. Oreder Stuffs
//3. Criar o boleto no VPSA
//4. Atualizar no Firebse [ subscription.billet.link,  subscription.billet.status]
//5. Enviar o boleto para o usuário.
//6. Atualizar no Firebse [ subscription.status = PENDING_USER_ACTION]

//OBS.: Foram criados dois enums para o status do boleto e para o status da subscricao. Para os casos de falha
//dos itens acima, verificar quais status melhor caracterizam a situação do processo. Se houver uma falha de validação
//é importante marcar o subscription.status com SubscriptionStatus.FINISHED = 'FINISHED' e criar um subscription.erroMessage com a descricao do erro.
//OBS2: [ subscription.status = PENDING_USER_ACTION] é o disparo do processo pela crontab. A verificação de boletos
//será realizada somente nesse status.

	
	], function(err, result) {
		if(err) {
			callback('[BilletController.handleBillet][Billet Controller flow executed with errors: '+ err+']', null);
		} else {
			callback(null, '[BilletController.handleBillet][Billet Controller flow executed successfully: '+ results+']');	

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
          BilletService.updateBilletStatus(subscription, billet, callback)
        },        
        function(subscription, billet, callback) {
          BilletService.notifyPayedBilletToGlowingRestApi(subscription, billet, callback)
        },
        function(subscription, billet, callback) {
          EmailService.sendBilletToCustomer(subscription, billet, callback)
        },
        function(subscription, billet, callback) {
          BilletService.updateSubscriptionStatus(subscription, billet, callback)
        }
      ], function(err, result) {
        if(err) {          
          console.log('[BilletController.handleBilletsPaymentStatusProcess][Errors: '+err+']');
        } else {
          console.log('[BilletController.handleBilletsPaymentStatusProcess][Result: Succefully executed]');
        }     
      });
  }
  callback();  
};

//0. Veririficar validações no início do processo.
//1. Obtém os boletos PENDING_USER_ACTION e inicia o processo abaixo para cada um deles.
//2. Consulta o status do boleto no VPSA e altera o status de subscription.billet.status.
//3. SE PAGO -> Define a nova data de expiração
//4. SE PAGO -> Notifica via push o glowing-catalgog
//5. SE PAGO -> Envia o e-mail para o cliente.
//6. SE OUTRO STATUS -> Atualiza subscription.status para FINISHED e subscription.billet.status para o status VPSA.

//Obs.: Retentativas:
//A. Boletos não serão eternamente consultados porque o EDI muda para não pago.
//B. O início do processo é com PENDING_USER_ACTION.

/*
  verificar formato enviado para o wesley.

"subscription-consultant-update-queue".uuid = UUID gerado pelo Glowing ERP Integrator que será o mesmo uuid da estrutura https://voppwishlist.firebaseio.com/subscripitons/uuid.
"subscription-consultant-update-queue".consultant.uuid = UUID da consultora no Glowing-Catalog.
"subscription-consultant-update-queue".consultant.email = E-mail da consultora no Glowing-Catalog.
"subscription-consultant-update-queue".consultant.newSubscriptionExpirationDate = Sobrescrever a data presente no campo consultant.subscriptionExpirationDate com essa data.
  */