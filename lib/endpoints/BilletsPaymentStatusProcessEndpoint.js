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
    async.waterfall([
       function(callback) {
          SubscriptionController.getPengingUserActionSubscriptions(callback)
       }, 
       function(pengingUserActionSubscriptions, callback) {
          BilletController.handleBilletsPaymentStatusProcess(pengingUserActionSubscriptions, callback);          
       }
    ], function(err, results) {
      if(err) {
         res.json(HttpStatus.INTERNAL_SERVER_ERROR, {
            message : err.message,
            code : RequestError.SERVER_ERROR
         });
        console.log('[BilletsPaymentStatusProcessEndpoint.handleBilletsPaymentStatusProcess][Worker flow executed with errors: '+ err+']');
        return;
      } else {
        console.log('[BilletsPaymentStatusProcessEndpoint.handleBilletsPaymentStatusProcess][Worker flow executed successfully]');
        res.json(HttpStatus.OK, results);
      }  
    }); 
};
  return [
    Parameters(),
    handler
  ];
};