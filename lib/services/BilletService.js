'use strict';

var BilletVPSAClient = require('../clients/vpsa/BilletVPSAClient');
var FirebaseBackend = require('../backends/FirebaseBackend');
var Config = require('../Config');
var ArrayUtil = require('../utils/ArrayUtil');
var BilletService = {};

exports = module.exports = BilletService;

BilletService.validateSubscriptionSnapshot = function (subscriptionSnapshot, callback) {
	var err = '';

	if(err) {
		return callback(err, null);
  	}

  	callback(null, '[BilletService.validateBilletRequest OK]');
};

BilletService.requestBilletGenerationToVPSA = function (subscriptionSnapshot, callback) {
	BilletVPSAClient.requestBilletGenerationToVPSA(billetRequestSnapshot, function(err, results) {
	    	if(err) {
				callback(err, null);
			} else {
				callback(null, results);
			}
	    }
	);
};

BilletService.getBilletBytesFromVPSA = function (subscriptionSnapshot, callback) {
	setTimeout(function () {
	    BilletVPSAClient.getBilletBytesFromVPSA(billetRequestSnapshot, function(err, results) {
		    	if(err) {
					callback(err, null);
				} else {
					callback(null, results);
				}
		    }
		);
	}, 5000);
};

BilletService.verifyBilletStatus = function (subscriptionSnapshot, callback) {	
	FirebaseBackend.get( config.consumer.SUBSCRIPTION_CONSULTANT_REQUEST_CHILD , function (err, result){
		
		result = [
		{
			'uuid':'1', 'planType':'ANUAL_12X', 'date': 1383066000000, 'status': 'PENDING','consultant':{'uuid':'234234', 'subscriptionExpirationDate':1383066000000, 'name':'Joao da Silva', 'cep':'12122333','address':{'street': 'rua', 'number': 555},'cpf':'33344433322','email':
			'ddd@ddd.com','cityOrigin':'sao paulo','countryOrigin':'brasil','complement':'apto 333','phone':'11 3333 4444','cellphone':'11 98444 2322','emailPrimer':'dsfsdf@ddd.com'} 
		},		
		{
			'uuid':'2', 'planType':'ANUAL_12X', 'date': 1383066000000, 'status': 'PAID','consultant':{'uuid':'234234', 'subscriptionExpirationDate':1383066000000, 'name':'Joao da Silva', 'cep':'12122333','address':{'street': 'rua', 'number': 555},'cpf':'33344433322','email':
			'ddd@ddd.com','cityOrigin':'sao paulo','countryOrigin':'brasil','complement':'apto 333','phone':'11 3333 4444','cellphone':'11 98444 2322','emailPrimer':'dsfsdf@ddd.com'} 
		},		
		{
			'uuid':'3', 'planType':'ANUAL_12X', 'date': 1383066000000, 'status': 'PENDING','consultant':{'uuid':'234234', 'subscriptionExpirationDate':1383066000000, 'name':'Joao da Silva', 'cep':'12122333','address':{'street': 'rua', 'number': 555},'cpf':'33344433322','email':
			'ddd@ddd.com','cityOrigin':'sao paulo','countryOrigin':'brasil','complement':'apto 333','phone':'11 3333 4444','cellphone':'11 98444 2322','emailPrimer':'dsfsdf@ddd.com'} 
		}];		
		
		result = ArrayUtil.filter(result, [{
			'field': 'status',
			'value': 'PENDING'
		}]);
		
		console.log( JSON.stringify(result) );
		console.log( result.length );
	});
};