'use strict';
var OrderVPSAClient = require('../clients/vpsa/OrderVPSAClient');
var Config = require('../Config');
var VPSABilletPaymentPlan = require('../enum/VPSABilletPaymentPlan');
var OrderService = {};
exports = module.exports = OrderService;

OrderService.createNewOrderService = function (newOrderService, callback) {
	var validation = true;
	
	if(!newOrderService){
		validation = false;
		callback('[OrderService.createNewOrderService][Error: newOrderService parameter is invalid]');
	}else if(newOrderService.idEntidade != Config.order.ENTIDADE || newOrderService.idTerceiro != Config.order.TERCEIRO || newOrderService.idRepresentante != Config.order.REPRESENTANTE){
		validation = false;
		callback('[OrderService.createNewOrderService][Error: check the following attributes: idEntidade, idTerceiro and idRepresentante]');
	}else if(newOrderService.idPlanoPagamento != VPSABilletPaymentPlan.CASH && newOrderService.idPlanoPagamento != VPSABilletPaymentPlan.SIXTIMES && newOrderService.idPlanoPagamento != VPSABilletPaymentPlan.TWELVETIMES)	{
		validation = false;
		callback('[OrderService.createNewOrderService][Error: idPlanoPagamento attribute is invalid]');
	}else if(!newOrderService.servicos){
		validation = false;
		callback('[OrderService.createNewOrderService][Error: servicos attribute is invalid]');
	}else{
		//TODO: validar ids dos serviços
		/*for (var servico in newOrderService.servicos.lenght) {
			if(!servico || servico.idServico != Config.order.SERVICO){
				callback('[OrderService.createNewOrderService][Error: idServico attribute from servicos is invalid]');
				validation = false;
			}
		}*/
	}
	
	if(validation){
		OrderVPSAClient.create(JSON.stringify(newOrderService), function(err, result){
			if(err){
				callback(err);
			}else{			
				callback(null, '[OrderService.createNewOrderService][Success: order service created with success, id ' + result + ']');
			}
		});
	}
};

OrderService.getOrderServiceById = function (idOrderService, callback) {
	if(!idOrderService || typeof idOrderService != 'number'){
		callback('[OrderService.getOrderServiceById][Error: idOrderService parameter is invalid]');
	}else{
		OrderVPSAClient.get(idOrderService, callback);		
	}
};