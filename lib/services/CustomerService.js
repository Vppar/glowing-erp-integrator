'use strict';
var CustomerVPSAClient = require('../clients/vpsa/CustomerVPSAClient');
var CustomerService = {};
exports = module.exports = CustomerService;

CustomerService.getCustomerByDocument = function (customerDocument, callback) {
	if(!customerDocument || typeof customerDocument != 'string'){
		callback('[CustomerService.getCustomerByDocument][Error: customerDocument parameter is invalid]');
	}else{
		CustomerVPSAClient.getByDocument(customerDocument, callback);
	}
};

CustomerService.updateCustomerToSendBillet = function (updateCustomer, idUpdateCustomer, callback) {
	if(!updateCustomer){
		callback('[CustomerService.updateCustomerToSendBillet][Error: updateCustomer parameter is empty]');
	}else if(!idUpdateCustomer || typeof idUpdateCustomer != 'number'){
		callback('[CustomerService.updateCustomerToSendBillet][Error: customer invalid]');
	}else{
		CustomerVPSAClient.getById(idUpdateCustomer, function(err, result){
			if(err){
				callback(err);
			} else if(result === 'Nenhum registro encontrado') {
					callback(result);
				}else{					
					CustomerVPSAClient.update(JSON.stringify(updateCustomer), idUpdateCustomer, function(err, result){
						if(err){
							callback(err);
						}else{
							callback(null, '[CustomerService.updateCustomerToSendBillet][Success: customer updated with success, id ' + result + ']');
						}
					});
				}
		});
	}
};

CustomerService.createNewCustomer = function (newCustomer, callback) {
	if(!newCustomer){
		callback('[CustomerService.createNewCustomer][Error: newCustomer parameter is empty]');
	} else if(!newCustomer.nome || !newCustomer.documento || !newCustomer.enderecos) {
		callback('[CustomerService.createNewCustomer][Error: check the following attributes: nome, documento and enderecos]');
	 }else{
		CustomerVPSAClient.create(JSON.stringify(newCustomer), function(err, result){
			if(err){
				callback(err);
			}else{			
				callback(null, '[CustomerService.createNewCustomer][Success: customer created with success, id ' + result + ']');
			}
		});
	}
};