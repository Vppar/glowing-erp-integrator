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
    console.log('[ProcessBilletsStatusEndpoint.handle][Starting service...]');
    
      ProcessBilletsStatusController.handle(function(err, result) {
          if(err) {
            res.json(HttpStatus.INTERNAL_SERVER_ERROR, {
                     message : err.message,
                     code : RequestError.SERVER_ERROR
            });
            console.log('[ProcessBilletsStatusEndpoint.handle][Erros: '+ err+']');
            return;
          } else {
            console.log('[ProcessBilletsStatusEndpoint.handle][Result: Successfully executed]');
            res.json(HttpStatus.OK, result);
          } 
      });
    };
    return [
      Parameters(),
      handler
    ];  
};