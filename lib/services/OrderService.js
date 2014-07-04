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
		callback('[OrderService.create][Error: subscription parameter is invalid]');
	}else{
		OrderService.adaptSubscriptionToOrderService(orderService, subscription, callback);
	}
		
	if(orderService.idEntidade != Config.order.ENTIDADE || orderService.idRepresentante != Config.order.REPRESENTANTE){
		validation = false;
		callback('[OrderService.create][Error: check the following attributes: idEntidade, idTerceiro and idRepresentante]');
	}else if(orderService.idPlanoPagamento != VPSASubscriptionPlanType.CASH && orderService.idPlanoPagamento != VPSASubscriptionPlanType.SIXTIMES && orderService.idPlanoPagamento != VPSASubscriptionPlanType.TWELVETIMES)	{
		validation = false;
		callback('[OrderService.create][Error: idPlanoPagamento attribute is invalid]');
	}else if(!orderService.servicos){
		validation = false;
		callback('[OrderService.create][Error: servicos attribute is invalid]');
	}
	
	if(validation){
		OrderVPSAClient.create(JSON.stringify(orderService), function(err, result){
			if(err){
				callback(err);	
			}else{
				console.log('Pedido de venda criado com sucesso');
				
				subscription.pedidoVendaId = result;
				callback(null, '[OrderService.create][Success: order service created with success, id ' + result + ']');
			}
		});
	}
};

OrderService.adaptSubscriptionToOrderService = function(orderService, subscription, callback){
	var planType = subscription.snapshot.planType;
	
	if(planType != GlowingSubscriptionPlanType.ONEMONTH.name && planType != GlowingSubscriptionPlanType.GLOSS.name && planType != GlowingSubscriptionPlanType.BLUSH.name){
		callback('[OrderService.adaptSubscriptionToOrderService][Error: subscription planType invalid]');
	}else{
		var servicos = {
		  idServico: Config.order.SERVICO,
		  quantidade: 1,
		  valorDesconto: '0.00',
		  valorUnitario: GlowingSubscriptionPlanType[planType].totalAmount
		} 
		
	 	orderService.data = DateTimeUtil.getCurrentDate();
	 	orderService.horario = DateTimeUtil.getCurrentHour();
	 	orderService.idEntidade = Config.order.ENTIDADE;
	 	orderService.idPlanoPagamento = VPSASubscriptionPlanType.CASH;
	 	orderService.idRepresentante = Config.order.REPRESENTANTE;
	 	orderService.idTerceiro = subscription.snapshot.consultant.idConsultant;
	 	orderService.valorFrete = '0.00';
	 	orderService.valorOutros = '0.00'; 
	 	orderService.valorSeguro = '0.00';
	 	orderService.servicos = [servicos]; 
	}
}

OrderService.get = function (idOrderService, callback) {
	 if(!idOrderService){
		 callback('[OrderService.get][Error: idOrderService parameter is invalid]');
	 }else{
		 OrderVPSAClient.get(idOrderService, callback);  
	 }
};