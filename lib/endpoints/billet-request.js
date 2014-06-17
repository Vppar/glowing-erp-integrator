/**
 * Defines the endpoint functions for billet handling.
 */

'use strict';

var config = require('../config');
var HttpStatus = require('../enum/httpStatus');
var RequestError = require('../enum/requestError');
var parameters = require('../middlewares/parameters');
var BilletRequestController = require('../controllers/billet-request');
var UserController = require('../controllers/user');

var BilletRequestEndpoint = {};
exports = module.exports = BilletRequestEndpoint;

BilletRequestEndpoint.create = function () {
  function handler(req, res) {
    UserController.fakeAuthenticate(req.body, function (err, user) {
      if (err) {
        res.json(HttpStatus.INTERNAL_SERVER_ERROR, {
          message : err.message,
          code : RequestError.SERVER_ERROR
        });
        return;
      }

      if (!user) {
        res.json(HttpStatus.UNAUTHORIZED, {
          message : 'Authentication failed',
          code : RequestError.AUTHENTICATION_FAILED
        });
        return;
      }

      BilletRequestController.create(req, function (err, data) {
        if (err) {
          res.json(HttpStatus.INTERNAL_SERVER_ERROR, {
            message : err.message,
            code : RequestError.SERVER_ERROR
          });
          return;
        }

        if (data) {
          res.json(HttpStatus.CREATED, data);
        } else {
          console.log('TESTENAO2');
          res.json(HttpStatus.UNAUTHORIZED, {
            message : 'Authentication failed',
            code : RequestError.AUTHENTICATION_FAILED
          });
        }
      });
    });
  }

  return [
    parameters({body : ['email','cpf']}),
    handler
  ];
};

BilletRequestEndpoint.getData = function () {
  function handler(req, res) {
    }
    return [
    parameters({body : ['email','cpf']}),
    handler
  ];
  };

  BilletRequestEndpoint.end = function () {
  function handler(req, res) {
    }
    return [
    parameters({body : ['email','cpf']}),
    handler
  ];
  };

  BilletRequestEndpoint.refresh = function () {
  function handler(req, res) {
    }
    return [
    parameters({body : ['email','cpf']}),
    handler
  ];
  };