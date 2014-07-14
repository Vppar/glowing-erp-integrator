'use strict';
var OrderVPSAClient = require('../clients/vpsa/OrderVPSAClient');
var Config = require('../Config');
var VPSASubscriptionPlanType = require('../enum/VPSASubscriptionPlanType');
var GlowingSubscriptionPlanType = require('../enum/GlowingSubscriptionPlanType');
var DateTimeUtil = require('../utils/DateTimeUtil');

var OrderService = {};
exports = module.exports = OrderService;

OrderService.create = function (subscription, callback) {
	var orderService = {};
	
	if(!subscription){
		callback('[OrderService.create][Subscription: '+subscription.uuid+'][Error: Subscription parameter is invalid]');
	}else{
		OrderService.adaptSubscriptionToOrderService(subscription.uuid, orderService, subscription, function(err){
			if(err){
				callback(err);
			}else{
				OrderVPSAClient.create(subscription.uuid, JSON.stringify(orderService), function(err, result){
					if(err){
						callback(err);	
					}else{		
						subscription.pedidoVendaId = result;
						callback(null, '[OrderService.create][Subscription: '+subscription.uuid+'][Success: order service created with success, id ' + result + ']');
					}
				});
			}
		});
	}
};

OrderService.adaptSubscriptionToOrderService = function(subscriptionUUID, orderService, subscription, callback){
	if(subscription.snapshot && subscription.snapshot.planType){
		var servico = {
			idServico: Config.order.SERVICO,
			quantidade: 1,
			valorDesconto: Config.order.amount.ZERO,
			valorUnitario: GlowingSubscriptionPlanType[subscription.snapshot.planType].totalAmount
		} 
		
		if(servico.valorUnitario && subscription.snapshot.consultant && subscription.snapshot.consultant.idConsultant){
			orderService.data = DateTimeUtil.getCurrentDate();
			orderService.horario = DateTimeUtil.getCurrentHour();
			orderService.idEntidade = Config.order.ENTIDADE;
			orderService.idPlanoPagamento = VPSASubscriptionPlanType.CASH;
			orderService.idRepresentante = Config.order.REPRESENTANTE;
			orderService.idTerceiro = subscription.snapshot.consultant.idConsultant;
			orderService.valorFrete = Config.order.amount.ZERO;
			orderService.valorOutros = Config.order.amount.ZERO; 
			orderService.valorSeguro = Config.order.amount.ZERO;
			orderService.servicos = [servico]; 
		}else{
			callback('[OrderService.adaptSubscriptionToOrderService][Subscription: '+subscriptionUUID+'][Error: check the following attribute: servico.valorUnitario or consultant]');
		}
	}else{
		callback('[OrderService.adaptSubscriptionToOrderService][Subscription: '+subscriptionUUID+'][Error: check the following attribute: snapshot.planType]');
	}
}

OrderService.get = function (subscriptionUUID, idOrderService, callback) {
	 if(!idOrderService){
		 callback('[OrderService.get][Subscription: '+subscriptionUUID+'][Error: IdOrderService parameter is invalid]');
	 }else{
		 OrderVPSAClient.get(subscriptionUUID, idOrderService, callback);  
	 }
};