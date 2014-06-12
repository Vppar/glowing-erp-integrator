/**
 * Defines the session-related business logic.
 */

'use strict';

var crypto = require('crypto');

var config = require('../config');
var SessionStorage = require('../storages/session');


var SessionController = {};
exports = module.exports = SessionController;


// TODO
function createToken(userId, salt) {
  var random = Math.floor(Math.random() * 10000001);
  return crypto
    .createHash('sha256')
    .update(random + ':' + userId + ':' + salt)
    .digest('hex');
}


SessionController.create = function (userId, expires, callback) {
  expires = expires || null;

  var token = createToken(userId, config.TOKEN_SALT);
  var refresh = createToken(userId, config.TOKEN_REFRESH_SALT);

  var now = new Date().getTime();

  SessionStorage.save({
    token : token,
    refresh : refresh,
    expires : expires,
    userId : userId,
    created : now
  }, callback);
};


SessionController.get = function (token, callback) {
  SessionStorage.get(token, callback);
};


SessionController.refresh = function (token, refreshToken, callback) {
  SessionStorage.get(token, function (err, oldSession) {
    if (err) {
      return callback(err, null);
    }

    // No session found with the given token or its refresh token does not
    // match the one passed in the request.
    if (
      !oldSession ||
      oldSession.refresh !== refreshToken
    ) {
      return callback(null, null);
    }

    // A session has been found. We'll destroy it before creating the new one.
    SessionController.destroy(token, function (err) {
      if (err) {
        return callback(err, null);
      }

      // Old session destroyed. Create the new one.
      SessionController.create(
        oldSession.userId,
        oldSession.expires,
        function (err, newSession) {
          if (err) {
            return callback(err, null);
          }

          callback(null, newSession);
        }); // create
    }); // remove
  }); // get
};


// TODO: implement this
SessionController.isActive = function (token) {
  return !!token;
};


SessionController.destroy = function (token, callback) {
  SessionStorage.remove(token, callback);
};


