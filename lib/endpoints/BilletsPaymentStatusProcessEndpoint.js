'use strict';

var Config = require('../Config');
var Parameters = require('../middlewares/Parameters');
var HttpStatus = require('../enum/HttpStatus');
var RequestError = require('../enum/RequestError');
var BilletController = require('../controllers/BilletController');
var SubscriptionController = require('../controllers/SubscriptionController');
var BilletsPaymentStatusProcessEndpoint = {};

exports = module.exports = BilletsPaymentStatusProcessEndpoint;

var async = require('async');

BilletsPaymentStatusProcessEndpoint.handleBilletsPaymentStatusProcess = function () {
  function handler(req, res) {
    console.log('[BilletsPaymentStatusProcessEndpoint.handleBilletsPaymentStatusProcess][Starting service...]');
    async.waterfall([
       function(callback) {
          SubscriptionController.getPengingUserActionSubscriptions(callback)
       }, 
       function(pengingUserActionSubscriptions, callback) {
          for(var i = 0; i<pengingUserActionSubscriptions.length; i++) {
            BilletController.handleBilletsPaymentStatusProcess(pengingUserActionSubscriptions[i], callback);          
          }
       }
    ], function(err, results) {
      if(err) {
         res.json(HttpStatus.INTERNAL_SERVER_ERROR, {
            message : err.message,
            code : RequestError.SERVER_ERROR
         });
        console.log('[BilletsPaymentStatusProcessEndpoint.handleBilletsPaymentStatusProcess][Erros: '+ err+']');
        return;
      } else {
        console.log('[BilletsPaymentStatusProcessEndpoint.handleBilletsPaymentStatusProcess][Result: Successfully executed]');
        res.json(HttpStatus.OK, results);
      }  
    }); 
};
  return [
    Parameters(),
    handler
  ];
};