'use strict';
var CustomerVPSAClient = require('../clients/vpsa/CustomerVPSAClient');
var IbgeUtil = require('../utils/IbgeUtil');
var Config = require('../Config');
var CustomerService = {};
exports = module.exports = CustomerService;

CustomerService.getByDocument = function (subscriptionUUID, customerDocument, callback) {
	if(!customerDocument || typeof customerDocument != 'string'){
		callback('[CustomerService.getByDocument][Subscription: '+subscriptionUUID+'][Error: customerDocument parameter is invalid]');
	}else{
		CustomerVPSAClient.getByDocument(subscriptionUUID, customerDocument, callback);
	}
};

CustomerService.update = function (subscriptionUUID, updateCustomer, idUpdateCustomer, callback) {
	if(!updateCustomer){
		callback('[CustomerService.update][Subscription: '+subscriptionUUID+'][Error: updateCustomer parameter is empty]');
	}else if(!idUpdateCustomer || typeof idUpdateCustomer != 'number'){
		callback('[CustomerService.update][Subscription: '+subscriptionUUID+'][Error: customer invalid]');
	}else{
		CustomerVPSAClient.getById(idUpdateCustomer, function(err, result){
			if(err){
				callback(err);
			} else if(result === Config.customer.NOT_FOUND) {
					callback(result);
				}else{					
					CustomerVPSAClient.update(JSON.stringify(updateCustomer), idUpdateCustomer, function(err, result){
						if(err){
							callback(err);
						}else{
							callback(null, '[CustomerService.update][Subscription: '+subscriptionUUID+'][Success: Customer updated with success, id ' + result + ']');
						}
					});
				}
		});
	}
};

CustomerService.create = function (subscriptionUUID, newCustomer, callback) {
	if(!newCustomer){
		callback('[CustomerService.create][Subscription: '+subscriptionUUID+'][Error: NewCustomer parameter is empty]');
	} else if(!newCustomer.nome || !newCustomer.documento || !newCustomer.enderecos) {
		callback('[CustomerService.create][Subscription: '+subscriptionUUID+'][Error: Check the following attributes: nome, documento and enderecos]');
	 }else{
		CustomerVPSAClient.create(JSON.stringify(newCustomer), function(err, result){
			if(err){
				callback(err);
			}else{			
				callback(null, '[CustomerService.create][Subscription: '+subscriptionUUID+'][Success: Customer created with success, id ' + result + ']');
			}
		});
	}
};

CustomerService.mergeCustomer = function(subscription, callback){
	var consultant = subscription.snapshot.consultant;
	var terceiroVPSA = {};
	
	if(!consultant){
		callback('[CustomerService.mergeCustomer][Subscription: '+subscription.uuid+'][Error: Customer parameter is invalid]');
	}else{
		CustomerService.getByDocument(subscription.uuid, consultant.cpf, function(err, result){
			if(err){
				callback(err);
			}else if(result == Config.customer.EMPTY_RESULT){
				CustomerService.adaptCustomerToTerceiroVPSA(subscription.uuid, terceiroVPSA, consultant, function(err){
					if(err){
						callback(err);						
					}else{
						CustomerVPSAClient.create(subscription.uuid, JSON.stringify(terceiroVPSA), function(err, result){
							if(err){
								callback(err);
							}else{
								consultant.idConsultant = result;						
								callback(null, '[CustomerService.mergeCustomer][Subscription: '+subscription.uuid+'][Success: customer created with success, id ' + result + ']');
							}
						});						
					}
				});
			} else {
				CustomerService.adaptCustomerToTerceiroVPSA(subscription.uuid, terceiroVPSA, consultant, function(err){
					if(err){
						callback(err);
					}else{
						CustomerVPSAClient.update(subscription.uuid, JSON.stringify(terceiroVPSA), JSON.parse(result)[0].id, function(err, result){
							if(err){
								callback(err);
							}else{								
								consultant.idConsultant = result;
								callback(null, '[CustomerService.mergeCustomer][Subscription: '+subscription.uuid+'][Success: customer updated with success, id ' + result + ']');
							}
						});						
					}					
				});			
			}
		});
	}
}

CustomerService.adaptCustomerToTerceiroVPSA = function(subscriptionUUID, terceiroVPSA, consultant, callback){
	var address = getAddress(subscriptionUUID, consultant);
	
	if(!address || !address.codigoIBGECidade){
		callback('[CustomerService.adaptCustomerToTerceiroVPSA][Subscription: '+subscriptionUUID+'][Error: Invalid consultant properties: address or codigoIBGECidade]');
	} else {			
		var phone = { numero: consultant.phone } 	
		var cellphone = { numero: consultant.cellphone }
		
		terceiroVPSA.nome =  consultant.name;
		terceiroVPSA.documento = consultant.cpf;
		terceiroVPSA.emails = [consultant.emailPrimer, consultant.email]; 
		terceiroVPSA.enderecos = [address];
		terceiroVPSA.telefones = [phone, cellphone];
		
		callback(null);
	}
}

function getAddress(subscriptionUUID, consultant) {
	//TODO: verificar
	 //|| consultant.address.street.split(' ')<2
	
	if(!consultant || !consultant.cep || !consultant.address || !consultant.address.street) {
		console.log('[CustomerService.adaptCustomerToTerceiroVPSA.getAddress][Subscription: '+subscriptionUUID+'][Error: Invalid consultant properties: cep,  address or street]');
		return null;
	}

	var fullStreet = consultant.address.street;
	var index = fullStreet.indexOf(' ');
	var street = fullStreet.substring(index+1);
	var type = fullStreet.substring(0, index).toUpperCase();
	var cep = consultant.cep.replace('.','').replace('-','').replace(' ','');
	var codIbge = IbgeUtil.codIbge[cep];
	
    if(type === Config.customer.STREET || type === Config.customer.S || type === Config.customer.S_) {
        type = Config.customer.STREET;
    } else if(type === Config.customer.AV || type === Config.customer.AVENUE || type === Config.customer.AV_) {
        type = Config.customer.AVENUE;
    } else if(type === Config.customer.ROAD) {
       type = Config.customer.ROAD;
    } else if(type === Config.customer.HIGHWAY) {
        type = Config.customer.HIGHWAY;
    } else {
    	type = Config.customer.STREET_DEFAULT_TYPE;
    	street = fullStreet;
    }
   
	var endereco = {
		tipo: type,
		logradouro: street,
		numero: consultant.address.number,
		bairro: Config.customer.NEIGHBORHOOD_DEFAULT,
		complemento: consultant.complement,
		cep: consultant.cep,
		codigoIBGECidade: codIbge
	}

	return endereco;
}