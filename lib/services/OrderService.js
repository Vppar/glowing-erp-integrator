'use strict';
var OrderVPSAClient = require('../clients/vpsa/OrderVPSAClient');
var OrderService = {};
exports = module.exports = OrderService;

OrderService.createNewOrderService = function (newOrderService, callback) {
	
	
	
	
	
	
};

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