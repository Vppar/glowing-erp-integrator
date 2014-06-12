/**
 * Defines the endpoint functions for token handling and generation.
 */

'use strict';

var config = require('../config');

var HttpStatus = require('../enum/httpStatus');
var RequestError = require('../enum/requestError');

var SessionController = require('../controllers/session');
var UserController = require('../controllers/user');

var authentication = require('../middlewares/authentication');
var parameters = require('../middlewares/parameters');

var SessionEndpoint = {};
exports = module.exports = SessionEndpoint;


SessionEndpoint.create = function () {
  function handler(req, res) {
    UserController.authenticate(req.body, function (err, user) {
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

      SessionController.create(user.id, config.TOKEN_EXPIRATION_TIME, function (err, data) {
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
          res.json(HttpStatus.UNAUTHORIZED, {
            message : 'Authentication failed',
            code : RequestError.AUTHENTICATION_FAILED
          });
        }
      });
    });
  }

  return [
    parameters({body : ['email', 'password']}),
    handler
  ];
};


SessionEndpoint.refresh = function () {
  function handler(req, res) {
    var token = req.query.token;
    var refresh = req.body.refresh;

    SessionController.refresh(token, refresh, function (err, session) {
      if (err) {
        res.json(HttpStatus.INTERNAL_SERVER_ERROR, {
          message : err.message,
          code : RequestError.SERVER_ERROR
        });
        return;
      }

      if (session) {
        res.json(HttpStatus.CREATED, session);
        return;
      }

      res.json(HttpStatus.UNAUTHORIZED, {
        message : 'Invalid tokens',
        code : RequestError.INVALID_TOKEN
      });
    });
  }

  return [
    parameters({
      query : ['token'],
      body : ['refresh']
    }),
    handler
  ];
};


SessionEndpoint.getData = function () {
  function handler(req, res) {
    res.json(HttpStatus.OK, req.session);
  }

  return [
    parameters({query : ['token']}),
    authentication(),
    handler
  ];
};


SessionEndpoint.end = function () {
  function handler(req, res) {
    if (!req.session) {
      res.json(HttpStatus.OK, {err : false});
      return;
    }

    SessionController.destroy(req.session, function (err) {
      if (err) {
        res.json(HttpStatus.INTERNAL_SERVER_ERROR, {
          message : 'Unknown error',
          code : RequestError.SERVER_ERROR
        });

        return;
      }

      res.json(HttpStatus.OK, {err : false});
    });
  }

  return [
    parameters({query : ['token']}),
    handler
  ];
};
