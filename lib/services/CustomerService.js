'use strict';
var CustomerVPSAClient = require('../clients/vpsa/CustomerVPSAClient');
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

CustomerService.getAll = function(callback){

}

CustomerService.getById = function(customerId, callback){

}

CustomerService.mergeCustomer = function(customer, callback){
	var terceiroVPSA = {};
	
	if(!customer){
		callback('[CustomerService.mergeCustomer][Error: customer parameter is invalid]');
	}else{
		CustomerService.getByDocument(customer.cpf, function(err, result){
			if(err){
				callback(err);
			}else if(result == '[]'){ 			//customer não cadastrado no vpsa
				console.log('customer não cadastrado no vpsa');
				
				CustomerService.adaptCustomerToTerceiroVPSA(terceiroVPSA, customer);
				CustomerVPSAClient.create(JSON.stringify(terceiroVPSA), function(err, result){			//cadastra customer no vpsa
					if(err){
						callback(err);
					}else{
						callback(null, 'terceiroVPSA criado na base do vpsa');
					}
				});
			}else{				    //customer cadastrado no vpsa
				console.log('customer cadastrado no vpsa');
				
				terceiroVPSA = JSON.parse(result)[0];
				CustomerService.adaptCustomerToTerceiroVPSA(terceiroVPSA, customer);
				CustomerVPSAClient.update(JSON.stringify(terceiroVPSA), terceiroVPSA.id, function(err, result){			//força um put
					if(err){
						callback(err);
					}else{
						callback(null, 'customer ja existia na base do vpsa e foi atualizado');
					}
				});
			}
		});
	}
}

CustomerService.adaptCustomerToTerceiroVPSA = function(terceiroVPSA, customer){
	//TODO: verificar bairro
	
	var endereco = {
		logradouro: customer.address.street;
		numero: customer.address.number;
		complemento: customer.complement;
		cep: customer.cep;	
		codigoIBGECidade: customer.cityOrigin; //verificar
	}
	
	terceiroVPSA.nome: customer.name;
	terceiroVPSA.documento: customer.cpf;
	terceiroVPSA.emails: [customer.emailPrimer, customer.email]; 
	terceiroVPSA.enderecos: [endereco];
	terceiroVPSA.telefones: [customer.phone, customer.cellphone];
}