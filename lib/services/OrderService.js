'use strict';
var OrderVPSAClient = require('../clients/vpsa/OrderVPSAClient');
var Config = require('../Config');
var GlowingSubscriptionPlanType = require('../enum/GlowingSubscriptionPlanType');
var DateTimeUtil = require('../utils/DateTimeUtil');

var OrderService = {};
exports = module.exports = OrderService;

OrderService.create = function (subscription, callback) {
	if(!subscription){
		callback('[OrderService.create][Subscription: '+subscription.uuid+'][Error: Subscription parameter is invalid]');
	}else{
		OrderService.adaptSubscriptionToOrderService(subscription.uuid, subscription, function(err, orderService){
			if(err){
				callback(err);
			}else{
				OrderVPSAClient.create(subscription.uuid, orderService, function(err, result){
					if(err){
						callback(err);	
					}else{	
						subscription.orderId = result;
						callback(null, result);
					}
				});
			}
		});
	}
};

OrderService.adaptSubscriptionToOrderService = function(subscriptionUUID, subscription, callback){
	if(subscription.snapshot && subscription.snapshot.planType){
		var plan = {};
		if(subscription.snapshot.planType === GlowingSubscriptionPlanType.BLUSH.name) {
			plan = GlowingSubscriptionPlanType.BLUSH;
		} else if(subscription.snapshot.planType === GlowingSubscriptionPlanType.GLOSS.name) {
			plan = GlowingSubscriptionPlanType.GLOSS;
		} else if (subscription.snapshot.planType === GlowingSubscriptionPlanType.RIMEL.name) {
			plan = GlowingSubscriptionPlanType.RIMEL;
		} else {
			callback('[OrderService.adaptSubscriptionToOrderService][Subscription: '+subscriptionUUID+'][Error: Invalid Plan Type '+subscription.snapshot.planType+']');
			return;
		}

		var servico = {
			idServico: Config.order.SERVICO,
			quantidade: 1,
			valorDesconto: Config.order.amount.ZERO,
			valorUnitario: plan.totalAmount
		}; 
		
		if(subscription.snapshot.consultant && subscription.snapshot.consultant.idConsultant){
			var orderService = {};
			orderService.data = DateTimeUtil.getCurrentDate();
			orderService.horario = DateTimeUtil.getCurrentHour();
			orderService.idEntidade = Config.order.ENTIDADE;
			orderService.idPlanoPagamento = Config.order.PLANO_PAGAMENTO;
			orderService.idRepresentante = Config.order.REPRESENTANTE;
			orderService.idTerceiro = subscription.snapshot.consultant.idConsultant;
			orderService.valorFrete = Config.order.amount.ZERO;
			orderService.valorOutros = Config.order.amount.ZERO; 
			orderService.valorSeguro = Config.order.amount.ZERO;
			orderService.servicos = [servico]; 
			callback(null, orderService);
		}else{
			callback('[OrderService.adaptSubscriptionToOrderService][Subscription: '+subscriptionUUID+'][Error: check the following attribute: servico.valorUnitario or consultant]');
		}
	}else{
		callback('[OrderService.adaptSubscriptionToOrderService][Subscription: '+subscriptionUUID+'][Error: check the following attribute: snapshot.planType]');
	}
};

OrderService.get = function (subscriptionUUID, idOrderService, callback) {
	 if(!idOrderService){
		 callback('[OrderService.get][Subscription: '+subscriptionUUID+'][Error: IdOrderService parameter is invalid]');
	 }else{
		 OrderVPSAClient.get(subscriptionUUID, idOrderService, callback);  
	 }
};