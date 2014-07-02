'use strict';

var async = require('async');

var EmailService = require('../services/EmailService');
var CustomerService = require('../services/CustomerService');
var OrderService = require('../services/OrderService');
var BilletService = require('../services/BilletService');
var BilletController = {};

exports = module.exports = BilletController;

BilletController.handleBillet = function (subscription, callback) {  
  console.log('\n[BilletController.handleBillet][Starting service...]');
	async.series([		  
  		function(callback) {
    		CustomerService.mergeCustomer(subscription.consultant, callback);
  		},
  		function(callback) {
    		OrderService.create(subscription, callback)
  		},  		
  		function(callback) {
    		BilletService.requestBilletGenerationToVPSA(subscription, callback)
  		}
  		
  		/*
    		BilletService.createBillet(subscription, callback)
  		},
  		function(callback) {
    		BilletService.getBilletBytesFromVPSA(subscription, callback)
  		},
  		function(callback) {
  		
  			// verificar o retorno com sucessoArrayUtil.js
  		
    		EmailService.sendBilletToCustomer(subscription, callback)
<<<<<<< Temporary merge branch 1
  		}*/

  		}
	], function(err, results) {
  		}
	], function(err, result) {
		if(err) {
			callback('[BilletController.handleBillet][Billet Controller flow executed with errors: '+ err+']', null);
		} else {
			callback(null, '[BilletController.handleBillet][Billet Controller flow executed successfully: '+ results+']');	

		}  		
	});
};

BilletController.handleBilletsPaymentStatusProcess = function (pengingUserActionSubscriptions, callback) {
  console.log('\n[BilletController.handleBilletsPaymentStatusProcess][Starting service...]');
  //TODO Change limit to 5 after tests
  async.eachLimit(pengingUserActionSubscriptions, 1, function( subscription, callback) {
      async.waterfall([        
        function(callback) {
          BilletService.getBilletJSON(subscription, callback)
        },
        function(billet, callback) {
          BilletService.updateBilletStatus(subscription, billet, callback)
        },
        function(billet, callback) {
          BilletService.notifyPayedBilletToGlowingRestApi(subscription, billet, callback)
        },
        function(message, billet, callback) {
          EmailService.sendBilletToCustomer(subscription, billet, callback)
        }
      ], function(err, result) {
        if(err) {
          //callback(err, null);
          console.log('1[BilletController.handleBilletsPaymentStatusProcess][Errors: '+err+']');
        } else {
          callback(null, result); 
        }     
      });
  }, function(err, result){
      if(err) {
        console.log('2[BilletController.handleBilletsPaymentStatusProcess][Billet Controller flow executed with errors: '+ err+']');
        callback(err, null);
      } else {
        console.log('3[BilletController.handleBilletsPaymentStatusProcess][Billet Controller flow executed successfully: '+ result+']');
        callback(null, result);
      }
  });
};