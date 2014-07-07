'use strict';
var OrderVPSAClient = require('../clients/vpsa/OrderVPSAClient');
var Config = require('../Config');
var VPSASubscriptionPlanType = require('../enum/VPSASubscriptionPlanType');
var GlowingSubscriptionPlanType = require('../enum/GlowingSubscriptionPlanType');
var DateTimeUtil = require('../utils/DateTimeUtil');

var OrderService = {};
exports = module.exports = OrderService;

OrderService.create = function (subscription, callback) {
	var validation = true;
	var orderService = {};
	
	if(!subscription){
		validation = false;
		callback('[OrderService.create][Subscription: '+subscription.uuid+'][Error: Subscription parameter is invalid]');
	}else{
		OrderService.adaptSubscriptionToOrderService(orderService, subscription);
	}
		
	if(orderService.idEntidade != Config.order.ENTIDADE || orderService.idRepresentante != Config.order.REPRESENTANTE){
		validation = false;
		callback('[OrderService.create][Subscription: '+subscription.uuid+'][Error: Check the following attributes: idEntidade, idTerceiro and idRepresentante]');
	}else if(orderService.idPlanoPagamento != VPSASubscriptionPlanType.CASH && orderService.idPlanoPagamento != VPSASubscriptionPlanType.SIXTIMES && orderService.idPlanoPagamento != VPSASubscriptionPlanType.TWELVETIMES)	{
		validation = false;
		callback('[OrderService.create][Subscription: '+subscription.uuid+'][Error: IdPlanoPagamento attribute is invalid]');
	}else if(!orderService.servicos){
		validation = false;
		callback('[OrderService.create][Subscription: '+subscription.uuid+'][Error: Servicos attribute is invalid]');
	}
	
	if(validation){
		OrderVPSAClient.create(subscription.uuid, JSON.stringify(orderService), function(err, result){
			if(err){
				callback(err);	
			}else{		
				subscription.pedidoVendaId = result;
				callback(null, '[OrderService.create][Subscription: '+subscription.uuid+'][Success: order service created with success, id ' + result + ']');
			}
		});
	}
};

OrderService.adaptSubscriptionToOrderService = function(orderService, subscription){
	var servicos = {
	  idServico: Config.order.SERVICO,
	  quantidade: 1,
	  valorDesconto: Config.order.amount.ZERO,
	  valorUnitario: GlowingSubscriptionPlanType[subscription.snapshot.planType].totalAmount
	} 
	
 	orderService.data = DateTimeUtil.getCurrentDate();
 	orderService.horario = DateTimeUtil.getCurrentHour();
 	orderService.idEntidade = Config.order.ENTIDADE;
 	orderService.idPlanoPagamento = VPSASubscriptionPlanType.CASH;
 	orderService.idRepresentante = Config.order.REPRESENTANTE;
 	orderService.idTerceiro = subscription.snapshot.consultant.idConsultant;
 	orderService.valorFrete = Config.order.amount.ZERO;
 	orderService.valorOutros = Config.order.amount.ZERO; 
 	orderService.valorSeguro = Config.order.amount.ZERO;
 	orderService.servicos = [servicos]; 
}

OrderService.get = function (subscriptionUUID, idOrderService, callback) {
	 if(!idOrderService){
		 callback('[OrderService.get][Subscription: '+subscriptionUUID+'][Error: IdOrderService parameter is invalid]');
	 }else{
		 OrderVPSAClient.get(subscriptionUUID, idOrderService, callback);  
	 }
};