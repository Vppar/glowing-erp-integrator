'use strict';

var Parameters = require('../middlewares/Parameters');
var HttpStatus = require('../enum/httpStatus');
var RequestError = require('../enum/requestError');
var ProcessBilletsStatusController = require('../controllers/ProcessBilletsStatusController');
var ProcessBilletsStatusEndpoint = {};

exports = module.exports = ProcessBilletsStatusEndpoint;

var async = require('async');

ProcessBilletsStatusEndpoint.handle = function () {
  function handler(req, res) {
    console.log('[ProcessBilletsStatusEndpoint.handle]['+new Date()+'][Starting service...]');
    async.waterfall([
       function(callback) {
          ProcessBilletsStatusController.getPengingUserActionSubscriptions(callback);
       }, 
       function(pengingUserActionSubscriptions, callback) {
        if(pengingUserActionSubscriptions && pengingUserActionSubscriptions.length >0) {
          for(var i = 0; i<pengingUserActionSubscriptions.length; i++) {
            ProcessBilletsStatusController.handle(pengingUserActionSubscriptions[i], callback);
          }
        } else {
          callback();
        }
       }
    ], function(err, results) {
      if(err) {
         res.json(HttpStatus.INTERNAL_SERVER_ERROR, {
            message : err.message,
            code : RequestError.SERVER_ERROR
         });
        console.log('[ProcessBilletsStatusEndpoint.handle][Erros: '+ err+']');
        return;
      } else {
        console.log('[ProcessBilletsStatusEndpoint.handle][Result: Successfully executed]');
        res.status(HttpStatus.OK).json(results);
      }
    });
  }
  return [
    new Parameters(),
    handler
  ];
};