'use strict';
var CustomerVPSAClient = require('../clients/vpsa/CustomerVPSAClient');
var IbgeUtil = require('../utils/IbgeUtil');
var Config = require('../Config');
var CustomerService = {};
exports = module.exports = CustomerService;

function getCustomerByDocument(subscriptionUUID, customerDocument, callback) {	
	if(!customerDocument || typeof customerDocument != 'string'){
		callback('[CustomerService.getByDocument][Subscription: '+subscriptionUUID+'][Error: customerDocument parameter is invalid]');
	}else{
		CustomerVPSAClient.getByDocument(subscriptionUUID, customerDocument, callback);
	}
};

CustomerService.create = function (subscriptionUUID, newCustomer, callback) {
	if(!newCustomer){
		callback('[CustomerService.create][Subscription: '+subscriptionUUID+'][Error: NewCustomer parameter is empty]');
	} else if(!newCustomer.nome || !newCustomer.documento || !newCustomer.enderecos) {
		callback('[CustomerService.create][Subscription: '+subscriptionUUID+'][Error: Check the following attributes: nome, documento and enderecos]');
	} else {
		CustomerVPSAClient.create(subscriptionUUID, newCustomer, callback);
	}
};

CustomerService.mergeCustomer = function(subscription, callback){
	var consultant = subscription.snapshot.consultant;
	
	if(!consultant || !consultant.cpf){
		callback('[CustomerService.mergeCustomer][Subscription: '+subscription.uuid+'][Error: Customer parameter is invalid]');
	}else{
		getCustomerByDocument(subscription.uuid, consultant.cpf, function(err, customer){
			if(err) {
				callback(err);
			} else {
				CustomerService.adaptCustomerToTerceiroVPSA(subscription.uuid, customer, consultant, function(err, terceiroVPSA){
					if(err) {
						callback(err);
					} else {
						if(terceiroVPSA && terceiroVPSA.id) {
							CustomerVPSAClient.update(subscription.uuid, terceiroVPSA, function(err, result){
								if(err){
									callback(err);
								}else{								
									consultant.idConsultant = result;
									callback(null, '[CustomerService.mergeCustomer][Subscription: '+subscription.uuid+'][Success: customer updated with success, id ' + result + ']');
								}
							});
						} else {
							CustomerVPSAClient.create(subscription.uuid, terceiroVPSA, function(err, result){
								if(err){
									callback(err);
								}else{
									consultant.idConsultant = result;						
									callback(null, '[CustomerService.mergeCustomer][Subscription: '+subscription.uuid+'][Success: customer created with success, id ' + result + ']');
								}
							});
						}
					}
				});
			}
		});
	}
}

CustomerService.adaptCustomerToTerceiroVPSA = function(subscriptionUUID, customer, consultant, callback){
	
	var address = getAddress(subscriptionUUID, consultant);
	
	if(!address || !address.codigoIBGECidade){
		callback('[CustomerService.adaptCustomerToTerceiroVPSA][Subscription: '+subscriptionUUID+'][Error: Invalid consultant properties: address or codigoIBGECidade]');
	} else {	
		var terceiroVPSA = {};
		if(customer && customer.id) {
			terceiroVPSA.id = customer.id;
		}
		
		terceiroVPSA.nome =  consultant.name;
		terceiroVPSA.documento = consultant.cpf;
		terceiroVPSA.emails = [consultant.emailPrimer, consultant.email]; 
		terceiroVPSA.enderecos = [address];
		 	
		terceiroVPSA.telefones = [];
		if( consultant.phone && consultant.phone.trim() != '' ){
			terceiroVPSA.telefones.push( { "numero": consultant.phone} );
		}
		if( consultant.cellphone && consultant.cellphone.trim() != '' ){
			terceiroVPSA.telefones.push( { "numero": consultant.cellphone} );
		}
		
		if( terceiroVPSA.telefones.length == 0 ){
			terceiroVPSA.telefones = undefined;
		}
		
		callback(null, terceiroVPSA);
	}
}

function getAddress(subscriptionUUID, consultant) {
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