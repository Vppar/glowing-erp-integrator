'use strict';

var BilletVPSAClient = require('../clients/vpsa/BilletVPSAClient');
var FirebaseBackend = require('../backends/FirebaseBackend');
var Config = require('../Config');
var ArrayUtil = require('../utils/ArrayUtil');
var async = require('async');
var BilletService = {};

exports = module.exports = BilletService;

BilletService.requestBilletGenerationToVPSA = function (subscription, callback) {
	BilletVPSAClient.requestBilletGenerationToVPSA(subscription, function(err, results) {
	    	if(err) {
				callback(err, null);
			} else {
				callback(null, results);
			}
	    }
	);
};

BilletService.getBilletBytesFromVPSA = function (subscription, callback) {
	setTimeout(function () {
	    BilletVPSAClient.getBilletBytesFromVPSA(subscription, function(err, results) {
		    	if(err) {
					callback(err, null);
				} else {
					callback(null, results);
				}
		    }
		);
	}, 5000);
};

BilletService.verifyBilletStatus = function (subscription, callback) {	
	FirebaseBackend.get( Config.CONSULTANT_SUBSCRIPTION_REQUEST_QUEUE_REF , function (err, result){
		
		result = [
		{
			'billetId':'1', 'uuid':'1', 'planType':'ANUAL_12X', 'date': 1383066000000, 'status': 'PENDING','consultant':{'uuid':'234234', 'subscriptionExpirationDate':1383066000000, 'name':'Joao da Silva', 'cep':'12122333','address':{'street': 'rua', 'number': 555},'cpf':'33344433322','email':
			'ddd@ddd.com','cityOrigin':'sao paulo','countryOrigin':'brasil','complement':'apto 333','phone':'11 3333 4444','cellphone':'11 98444 2322','emailPrimer':'dsfsdf@ddd.com'} 
		},		
		{
			'billetId':'2', 'uuid':'2', 'planType':'ANUAL_12X', 'date': 1383066000000, 'status': 'PAID','consultant':{'uuid':'234234', 'subscriptionExpirationDate':1383066000000, 'name':'Joao da Silva', 'cep':'12122333','address':{'street': 'rua', 'number': 555},'cpf':'33344433322','email':
			'ddd@ddd.com','cityOrigin':'sao paulo','countryOrigin':'brasil','complement':'apto 333','phone':'11 3333 4444','cellphone':'11 98444 2322','emailPrimer':'dsfsdf@ddd.com'} 
		},		
		{
			'billetId':'3', 'uuid':'3', 'planType':'ANUAL_12X', 'date': 1383066000000, 'status': 'PENDING','consultant':{'uuid':'234234', 'subscriptionExpirationDate':1383066000000, 'name':'Joao da Silva', 'cep':'12122333','address':{'street': 'rua', 'number': 555},'cpf':'33344433322','email':
			'ddd@ddd.com','cityOrigin':'sao paulo','countryOrigin':'brasil','complement':'apto 333','phone':'11 3333 4444','cellphone':'11 98444 2322','emailPrimer':'dsfsdf@ddd.com'} 
		}];		
		
		result = ArrayUtil.filter(result, [{
			'field': 'status',
			'value': 'PENDING'
		}]);
		
		async.forEach(result, 
			function (item, callback){
			
				BilletVPSAClient.get( item.billetId, function(err, result){
					if( err ){
						callback(err);
					}
					else {
						if( result && result.status && result.status === 'PAGO' ){
							
						}
						
						console.log(item.billetId +">> sucesso: "+ result);
						callback();
					}
				});
			}, 
			function(err) {
				console.log('iterating done '+ err);
			}
		);  		
	});
};