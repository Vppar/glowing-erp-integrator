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
	FirebaseBackend.get( Config.SUBSCRIPTION_REF , function (err, result){
			
		console.log(result);
		
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
							//TODO atualizar subscription
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