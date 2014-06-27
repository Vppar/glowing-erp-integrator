'use strict';

var Config = require('../Config');
var Parameters = require('../middlewares/Parameters');
var HttpStatus = require('../enum/HttpStatus');
var RequestError = require('../enum/RequestError');
var BilletController = require('../controllers/BilletController');
var BilletEndpoint = {};

exports = module.exports = BilletEndpoint;

BilletEndpoint.verifyBilletStatus = function () {
  function handler(req, res) {
      BilletController.verifyBilletStatus(function (err, data) {
        if (err) {
          res.json(HttpStatus.INTERNAL_SERVER_ERROR, {
            message : err.message,
            code : RequestError.SERVER_ERROR
          });
          console.log('[BilletEndpoint.verifyBilletStatus][ERROR= '+err+']');
          callback(err);
          return;
        }

        res.json(HttpStatus.CREATED, data);
        console.log('[BilletEndpoint.verifyBilletStatus][DATA= '+data+']');  
        return callback(null, user);              
      });
  }
  return [
    Parameters({body : ['OK']}),
    handler
  ];
};