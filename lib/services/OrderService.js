'use strict';
var OrderVPSAClient = require('../clients/vpsa/OrderVPSAClient');
var Config = require('../Config');
var VPSABilletPaymentPlan = require('../enum/VPSABilletPaymentPlan');
var VPSASubscriptionPlanType = require('../enum/VPSASubscriptionPlanType');
var DateTimeUtil = require('../utils/DateTimeUtil');

var OrderService = {};
exports = module.exports = OrderService;

OrderService.createNewOrderService = function (newOrderService, callback) {
OrderService.create = function (subscription, callback) {
	var validation = true;
	var orderService = {};
	
	if(!newOrderService){
		callback('[OrderService.createNewOrderService][Error: newOrderService parameter is invalid]');
	if(!subscription){
		validation = false;
	}else if(newOrderService.idEntidade != Config.order.ENTIDADE || newOrderService.idTerceiro != Config.order.TERCEIRO || newOrderService.idRepresentante != Config.order.REPRESENTANTE){
		callback('[OrderService.createNewOrderService][Error: check the following attributes: idEntidade, idTerceiro and idRepresentante]');
		callback('[OrderService.create][Error: subscription parameter is invalid]');
	}else{
		OrderService.adaptSubscriptionToOrderService(orderService, subscription);
	} 
		
	if(orderService.idEntidade != Config.order.ENTIDADE || orderService.idTerceiro != Config.order.TERCEIRO || orderService.idRepresentante != Config.order.REPRESENTANTE){
		validation = false;
	}else if(newOrderService.idPlanoPagamento != VPSABilletPaymentPlan.CASH && newOrderService.idPlanoPagamento != VPSABilletPaymentPlan.SIXTIMES && newOrderService.idPlanoPagamento != VPSABilletPaymentPlan.TWELVETIMES)	{
		callback('[OrderService.createNewOrderService][Error: idPlanoPagamento attribute is invalid]');
		callback('[OrderService.create][Error: check the following attributes: idEntidade, idTerceiro and idRepresentante]');
	}else if(orderService.idPlanoPagamento != VPSASubscriptionPlanType.CASH && orderService.idPlanoPagamento != VPSASubscriptionPlanType.SIXTIMES && orderService.idPlanoPagamento != VPSASubscriptionPlanType.TWELVETIMES)	{
		validation = false;
	}else if(!newOrderService.servicos){
		callback('[OrderService.createNewOrderService][Error: servicos attribute is invalid]');
		callback('[OrderService.create][Error: idPlanoPagamento attribute is invalid]');
	}else if(!orderService.servicos){
		validation = false;
	}else{
		//TODO: validar ids dos serviços
		/*for (var servico in newOrderService.servicos.lenght) {
			if(!servico || servico.idServico != Config.order.SERVICO){
				callback('[OrderService.createNewOrderService][Error: idServico attribute from servicos is invalid]');
				validation = false;
			}
		}*/
		callback('[OrderService.create][Error: servicos attribute is invalid]');
	}
	
	if(validation){
		OrderVPSAClient.create(JSON.stringify(newOrderService), function(err, result){
		OrderVPSAClient.create(JSON.stringify(orderService), function(err, result){
			if(err){
				callback(err);
			}else{			
				callback(null, '[OrderService.createNewOrderService][Success: order service created with success, id ' + result + ']');
				callback(null, '[OrderService.create][Success: order service created with success, id ' + result + ']');
			}
		});
	}
};

OrderService.getOrderServiceById = function (idOrderService, callback) {
OrderService.adaptSubscriptionToOrderService = function(orderService, subscription){
	var servicos = {
		idServico:Config.order.SERVICO,
		quantidade: 1,
		valorDesconto: '0.00',
		valorUnitario: '100.00' //pegar do enum GlowingCatalogSubscriptionPlanType
	}	
	
	orderService.data = DateTimeUtil.getCurrentDate();
	orderService.horario = DateTimeUtil.getCurrentHour();
	orderService.idEntidade = Config.order.ENTIDADE;
	orderService.idPlanoPagamento = VPSASubscriptionPlanType.CASH;
	orderService.idRepresentante = Config.order.REPRESENTANTE;
	orderService.idTerceiro = Config.order.TERCEIRO;
	orderService.valorFrete = '0.00';
	orderService.valorOutros = '0.00'; 
	orderService.valorSeguro = '0.00';
	orderService.servicos = [servicos];	
}

OrderService.get = function (idOrderService, callback) {
	if(!idOrderService || typeof idOrderService != 'number'){
		callback('[OrderService.getOrderServiceById][Error: idOrderService parameter is invalid]');
		callback('[OrderService.get][Error: idOrderService parameter is invalid]');
	}else{
		OrderVPSAClient.get(idOrderService, callback);		
	}
};