'use strict';
var SubscriptionStatus = require('../enum/SubscriptionStatus');
var BilletVPSAClient = require('../clients/vpsa/BilletVPSAClient');
var FirebaseBackend = require('../backends/FirebaseBackend');
var SubscriptionStorage = require('../storages/SubscriptionStorage');
var ConsultantSubscriptionUpdateGenerator = require('../workers/ConsultantSubscriptionUpdateGenerator'); 
var Config = require('../Config');
var VPSAPaymentStatus = require('../enum/VPSAPaymentStatus');
var ArrayUtil = require('../utils/ArrayUtil');
var async = require('async');

var BilletService = {};
exports = module.exports = BilletService;

BilletService.createBillet = function (newBillet, callback) {
	if(!newBillet){
		callback('[BilletService.createBillet][Error: newBillet parameter is invalid]');		
	}else if (!newBillet.idContaReceber || typeof newBillet.idContaReceber != 'number'){
		callback('[BilletService.createBillet][Error: check the following attribute: idContaReceber]');		
	}else if (newBillet.idCarteiraCobranca != Config.billet.CARTEIRADECOBRANCA){
		callback('[BilletService.createBillet][Error: check the following attribute: idCarteiraCobranca]');
	}else{
		BilletVPSAClient.create(JSON.stringify(newBillet), function(err, result){
			if(err){
				callback(err);
			}else{			
				callback(null, '[BilletService.createBillet][Success: billet created with success, id ' + result + ']');
			}
		});
	}
};

/*var newBillet = {
	idContaReceber:	1,
	idCarteiraCobranca: Config.billet.CARTEIRADECOBRANCA
}

BilletService.createBillet(newBillet, function(err, result){
	if(err) { console.log(err); }
	else { console.log(result);	}
});*/

BilletService.getBilletUrlPDF = function (billetId, callback) {
	if(!billetId || typeof billetId != 'number'){
		callback('[BilletService.getBilletUrlPDF][Error: billetId parameter is invalid]');
	}else{
		BilletVPSAClient.getUrlPDF(billetId, callback);
	}
};

/*BilletService.getBilletUrlPDF(2, function(err, result){
	if(err) { console.log(err); }
	else { console.log(result);	}
});*/

BilletService.getBilletJSON = function (billetId, callback) {
	if(!billetId || typeof billetId != 'number'){
		callback('[BilletService.getBilletJSON][Error: billetId parameter is invalid]');
	}else{
		BilletVPSAClient.get(billetId, callback);
	}
};

/*BilletService.getBilletJSON(null, function(err, result){
	if(err) { console.log(err); }
	else { console.log(result);	}
});*/

BilletService.verifyBilletStatus = function (subscriptionSnapshot, callback) {	
	FirebaseBackend.get( Config.CONSULTANT_SUBSCRIPTION_REQUEST_QUEUE_REF , function (err, result){
		
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
	}
};

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
	FirebaseBackend.get( Config.SUBSCRIPTION_REF , function (err, result){
BilletService.verifyBilletsStatus = function (subscription, callback) {	
	FirebaseBackend.get(subscriptionRef, function (err, results) {
		if(err) {
			callback(err, null);
		} 
			
		console.log(result);
		console.log('results>>>>>'+results);
		
		result = ArrayUtil.filter(result, [{
			'field': 'status',
			'value': 'PENDING'
		}]);
		var subscriptionsPendingUserAction = ArrayUtil.filter(results, [{'status': SubscriptionStatus.PENDING_USER_ACTION}]);
		
		async.forEach(result, 
			function (item, callback){
				BilletVPSAClient.get( item.billetId, function(err, result){
					if( err ){
						callback(err);
					}
					else {
						if( result && result.status && result.status === 'PAGO' ){
							//TODO atualizar subscription
		subscriptionsPendingUserAction.forEach(function(subscription) {
			BilletVPSAClient.get( subscription.billetUUID, function(err, result){
				console.log('result>>>>>'+result);
				if(err){
					callback(err);
				}

				if( result && result.status ){
					SubscriptionStorage.update(subscription.uuid, result.status, function(err) {
						if(err) {
							console.log('[BilletService.verifyBilletsStatus][Error updating subscription][UUID:'+subscription.uuid+'][Status: '+result.status+'][Erro: '+err+']');
						}
						
						console.log(item.billetId +">> sucesso: "+ result);
						callback();
					});

					if(VPSAPaymentStatus.PAYED = result.status) {	
						var consultantUUID = defineNewExpirationDate(subscription);
						var newSubscriptionExpirationDate = getConsultantUUID(subscription);
						ConsultantSubscriptionUpdateGenerator.updateConsultantExpirationDate(consultantUUID, newSubscriptionExpirationDate);		
					}
				});
			}, 
			function(err) {
				console.log('iterating done '+ err);
			}
		);  		
				}
			});			
		});		
	});
};
	callback(null, '[BilletService.verifyBilletsStatus][Process complete]');
};

function defineNewExpirationDate(subscription) {
	return '';
}

function getConsultantUUID(subscription) {
	return '';
}


				if( result && result.status ){
					SubscriptionStorage.update(subscription.uuid, result.status, function(err) {
						if(err) {
							console.log('[BilletService.verifyBilletsStatus][Error updating subscription][UUID:'+subscription.uuid+'][Status: '+result.status+'][Erro: '+err+']');
						}
					});

					if(VPSAPaymentStatus.PAYED = result.status) {	
						var consultantUUID = defineNewExpirationDate(subscription);
						var newSubscriptionExpirationDate = getConsultantUUID(subscription);
						ConsultantSubscriptionUpdateGenerator.updateConsultantExpirationDate(consultantUUID, newSubscriptionExpirationDate);		
					}
				}
			});			
		});		
	});
	callback(null, '[BilletService.verifyBilletsStatus][Process complete]');
};

function defineNewExpirationDate(subscription) {
	return '';
}

function getConsultantUUID(subscription) {
	return '';
}


// COMMIT + PUSH  + VERIFY PAYMENT STATUS BILLET FLOW