'use strict';
var CustomerVPSAClient = require('../clients/vpsa/CustomerVPSAClient');
var IbgeUtil = require('../utils/IbgeUtil');
var CustomerService = {};
exports = module.exports = CustomerService;

CustomerService.getByDocument = function (customerDocument, callback) {
	if(!customerDocument || typeof customerDocument != 'string'){
		callback('[CustomerService.getByDocument][Error: customerDocument parameter is invalid]');
	}else{
		CustomerVPSAClient.getByDocument(customerDocument, callback);
	}
};

CustomerService.update = function (updateCustomer, idUpdateCustomer, callback) {
	if(!updateCustomer){
		callback('[CustomerService.update][Error: updateCustomer parameter is empty]');
	}else if(!idUpdateCustomer || typeof idUpdateCustomer != 'number'){
		callback('[CustomerService.update][Error: customer invalid]');
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
							callback(null, '[CustomerService.update][Success: customer updated with success, id ' + result + ']');
						}
					});
				}
		});
	}
};

CustomerService.create = function (newCustomer, callback) {
	if(!newCustomer){
		callback('[CustomerService.create][Error: newCustomer parameter is empty]');
	} else if(!newCustomer.nome || !newCustomer.documento || !newCustomer.enderecos) {
		callback('[CustomerService.create][Error: check the following attributes: nome, documento and enderecos]');
	 }else{
		CustomerVPSAClient.create(JSON.stringify(newCustomer), function(err, result){
			if(err){
				callback(err);
			}else{			
				callback(null, '[CustomerService.create][Success: customer created with success, id ' + result + ']');
			}
		});
	}
};

CustomerService.mergeCustomer = function(consultant, callback){
	var terceiroVPSA = {};
	
	if(!consultant){
		callback('[CustomerService.mergeCustomer][Error: customer parameter is invalid]');
	}else{
		CustomerService.getByDocument(consultant.cpf, function(err, result){
			if(err){
				callback(err);
			}else if(result == '[]'){
				CustomerService.adaptCustomerToTerceiroVPSA(terceiroVPSA, consultant);
				CustomerVPSAClient.create(JSON.stringify(terceiroVPSA), function(err, result){
					if(err){
						callback(err);
					}else{
						consultant.idConsultant = result;						
						callback(null, '[CustomerService.mergeCustomer][Success: customer created with success, id ' + result + ']');
					}
				});
			} else {
				CustomerService.adaptCustomerToTerceiroVPSA(terceiroVPSA, consultant);
				CustomerVPSAClient.update(JSON.stringify(terceiroVPSA), JSON.parse(result)[0].id, function(err, result){
					if(err){
						callback(err);
					}else{
						consultant.idConsultant = result;
						callback(null, '[CustomerService.mergeCustomer][Success: customer updated with success, id ' + result + ']');
					}
				});
			}
		});
	}
}

CustomerService.adaptCustomerToTerceiroVPSA = function(terceiroVPSA, customer){
	var cep = customer.cep.replace('.','').replace('-','').replace(' ','');
	var codIbge = IbgeUtil.codIbge[cep];
	
	var endereco = {
		tipo: 'RUA',
		logradouro: customer.address.street,
		numero: customer.address.number,
		bairro: ' ',
		complemento: customer.complement,
		cep: customer.cep,
		codigoIBGECidade: codIbge
	}
	
	var phone = { numero: customer.phone } 	
	var cellphone = { numero: customer.cellphone }
	
	terceiroVPSA.nome =  customer.name;
	terceiroVPSA.documento = customer.cpf;
	terceiroVPSA.emails = [customer.emailPrimer, customer.email]; 
	terceiroVPSA.enderecos = [endereco];
	terceiroVPSA.telefones = [phone, cellphone];
}

CustomerService.getAll = function(callback){

}

CustomerService.getById = function(customerId, callback){

}