'use strict';

var Config = require('../Config');
var Parameters = require('../middlewares/Parameters');
var HttpStatus = require('../enum/HttpStatus');
var RequestError = require('../enum/RequestError');
var BilletController = require('../controllers/BilletController');
var BilletEndpoint = {};

exports = module.exports = BilletEndpoint;

BilletEndpoint.verifyBilletsStatus = function () {
  function handler(req, res) {
    BilletController.verifyBilletsStatus(function(err,result){
		if (err) {
          res.json(HttpStatus.INTERNAL_SERVER_ERROR, {
            message : err.message,
            code : RequestError.SERVER_ERROR
          });
          console.log('\n[BilletEndpoint.verifyBilletsStatus][Flow executed with errors: '+ err+']');
          return;
        }
        res.json(HttpStatus.OK, result);
        console.log(null, '[BilletEndpoint.verifyBilletsStatus][Flow executed successfully: '+ results+']');	
	  });
  }

  return [
    Parameters(),
    handler
  ];
};