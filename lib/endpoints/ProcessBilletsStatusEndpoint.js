'use strict';

var Config = require('../Config');
var Parameters = require('../middlewares/Parameters');
var HttpStatus = require('../enum/HttpStatus');
var RequestError = require('../enum/RequestError');
var ProcessBilletsStatusController = require('../controllers/ProcessBilletsStatusController');
var ProcessBilletsStatusEndpoint = {};

exports = module.exports = ProcessBilletsStatusEndpoint;

var async = require('async');

ProcessBilletsStatusEndpoint.handle = function () {
  function handler(req, res) {
    console.log('[ProcessBilletsStatusEndpoint.handleBilletsPaymentStatusProcess][Starting service...]');
    async.waterfall([
       function(callback) {
          ProcessBilletsStatusController.getPengingUserActionSubscriptions(callback)
       }, 
       function(pengingUserActionSubscriptions, callback) {
          for(var i = 0; i<pengingUserActionSubscriptions.length; i++) {
            ProcessBilletsStatusController.handle(pengingUserActionSubscriptions[i], callback);          
          }
       }
    ], function(err, results) {
      if(err) {
         res.json(HttpStatus.INTERNAL_SERVER_ERROR, {
            message : err.message,
            code : RequestError.SERVER_ERROR
         });
        console.log('[ProcessBilletsStatusEndpoint.handleBilletsPaymentStatusProcess][Erros: '+ err+']');
        return;
      } else {
        console.log('[ProcessBilletsStatusEndpoint.handleBilletsPaymentStatusProcess][Result: Successfully executed]');
        res.json(HttpStatus.OK, results);
      }  
    }); 
};
  return [
    Parameters(),
    handler
  ];
};