'use strict';
var OrderVPSAClient = require('../clients/vpsa/OrderVPSAClient');
var Config = require('../Config');
var PaymentBillet = require('../enum/PaymentBillet');
var OrderService = {};
exports = module.exports = OrderService;

OrderService.createNewOrderService = function (newOrderService, callback) {
	var validation = true;
	
	if(!newOrderService){
		callback('[OrderService.createNewOrderService][Error: newOrderService parameter is invalid]');
		validation = false;
	}else if(newOrderService.idEntidade != Config.order.ENTIDADE || newOrderService.idTerceiro != Config.order.TERCEIRO || newOrderService.idRepresentante != Config.order.REPRESENTANTE){
		callback('[OrderService.createNewOrderService][Error: check the following attributes: idEntidade, idTerceiro and idRepresentante]');
		validation = false;
	}else if(newOrderService.idPlanoPagamento != PaymentBillet.CASH && newOrderService.idPlanoPagamento != PaymentBillet.SIXTIMES && newOrderService.idPlanoPagamento != PaymentBillet.TWELVETIMES)	{
		callback('[OrderService.createNewOrderService][Error: idPlanoPagamento attribute is invalid]');
		validation = false;
	}else if(!newOrderService.servicos){
		callback('[OrderService.createNewOrderService][Error: servicos attribute is invalid]');
		validation = false;
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
		//TODO: verificar se é necessario converter o objeto newOrderService para string
		OrderVPSAClient.create(JSON.stringify(newOrderService), callback);
	}
};

/*var servicos = {
	idServico: Config.order.SERVICO,
	quantidade: 10.0,
	valorDesconto: 10.0,
	valorUnitario: 10.0
}

var orderService = {
	data: '28-06-2014',	
	horario: '15:28:05',
	idEntidade: Config.order.ENTIDADE,
	idTerceiro: Config.order.TERCEIRO,
	idRepresentante: Config.order.REPRESENTANTE,
	idPlanoPagamento: PaymentBillet.TWELVETIMES,
	valorFrete: 10.0,
	valorOutros: 10.0,
	valorSeguro:10.0,
	servicos: [servicos]
};

var content = '{';
content += '\'data\':\'29-06-2014\',';
content += '\'horario\':\'15:28:05\',';
content += '\'idEntidade\':' + Config.order.ENTIDADE + ',';
content += '\'idTerceiro\':' + Config.order.TERCEIRO + ',';
content += '\'idRepresentante\':' + Config.order.REPRESENTANTE +',';
content += '\'idPlanoPagamento\':' + PaymentBillet.CASH + ',';
content += '\'valorFrete\':23.80,';
content += '\'valorOutros\':10,';
content += '\'valorSeguro\':1.50,';
content += '\'servicos\':[{';
content += '\'idServico\':' + Config.order.SERVICO + ',';
content += '\'quantidade\':10,';
content += '\'valorUnitario\':11.50,';
content += '\'valorDesconto\':0.10';
content += '}]';
content += '}';

OrderService.createNewOrderService(content, function(err, result){
	if(err) { console.log(err); }
	else { console.log(result);	}
});*/

OrderService.getOrderServiceById = function (idOrderService, callback) {
	if(!idOrderService || typeof idOrderService != 'number'){
		callback('[OrderService.getOrderServiceById][Error: idOrderService parameter is invalid]');
	}else{
		OrderVPSAClient.get(idOrderService, function(err, result){
			if(err){
				callback(err);
			}else{
				var resultJson = JSON.stringify(result);
				callback(null, resultJson);				
			}
		});		
	}
};

/*OrderService.getOrderServiceById('', function(err, result){
	if(err) { console.log(err); }
	else { console.log(result);	}
});*/