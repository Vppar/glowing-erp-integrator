'use strict';

var config = require('../config');

var HttpStatus = require('../enum/httpStatus');
var RequestError = require('../enum/requestError');

var parameters = require('../middlewares/parameters');
var BilletRequestController = require('../controllers/billet-request');

var BilletRequestEndpoint = {};
exports = module.exports = BilletRequestEndpoint;


BilletRequestEndpoint.verifyBilletStatus = function () {
  function handler(req, res) {
      BilletRequestController.verifyBilletStatus(function (err, data) {
        if (err) {
          res.json(HttpStatus.INTERNAL_SERVER_ERROR, {
            message : err.message,
            code : RequestError.SERVER_ERROR
          });
          console.log('[BilletRequestEndpoint.verifyBilletStatus][ERROR= '+err+']');
          callback(err);
          return;
        }

        res.json(HttpStatus.CREATED, data);
        console.log('[BilletRequestEndpoint.verifyBilletStatus][DATA= '+data+']');  
        return callback(null, user);              
      });
  }
  return [
    parameters({body : ['OK']}),
    handler
  ];
};