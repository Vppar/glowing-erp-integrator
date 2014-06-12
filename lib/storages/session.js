/**
 * Defines methods for storing and retrieving session-related data.
 */

'use strict';

var FirebaseBackend = require('../backends/firebase');

var sessionsRef = FirebaseBackend.refs.base.child('sessions');


var SessionStorage = {};
exports = module.exports = SessionStorage;


function getToken(sessionOrToken) {
  if (sessionOrToken) {
    if (typeof sessionOrToken === 'string') {
      return sessionOrToken;
    }

    if (sessionOrToken.token) {
      return sessionOrToken.token;
    }
  }

  return null;
}


/**
 * Gets data associated with a token.
 * @param {String} token Token we want to get data for.
 * @param {function(err, data)} callback Callback to be called when the
 *  operation completes. It receives an error (if any) and the full
 *  data object associated with the given token. This object is `null`
 *  if no data is found for the given token.
 */
SessionStorage.get = function (token, callback) {
  var ref = sessionsRef.child(getToken(token));
  FirebaseBackend.get(ref, callback);
};


/**
 * Saves a new token.
 * @param {Object} session Token data.
 * @param {function(err, token, data)} callback Callback to be called with the result
 *  of the operation and the stored data. The callback receives an error (if
 *  any), the stored token and the full data object associated with it.
 */
SessionStorage.save = function (session, callback) {
  var ref = sessionsRef.child(getToken(session));
  FirebaseBackend.set(ref, session, null, callback);
};


/**
 * Updates the data associated with a token. Used mainly to revoke tokens.
 * @param {(Object|String)} sessionOrToken Session being updated.
 * @param {Object} update Object containing the properties to update.
 * @param {function(err, update)} callback Callback to be called when the
 *  operation completes. It receives an error (if any) and the full
 *  data object associated with the given token. This object is `null` if
 *  the token does not exist.
 */
SessionStorage.update = function (sessionOrToken, update, callback) {
  var ref = sessionsRef.child(getToken(sessionOrToken));
  FirebaseBackend.update(ref, update, callback);
};


/**
 * Removes the data associated with a token. This will delete all data related
 * to the token.
 * @param {(Object|String)} sessionOrToken Session to remove.
 * @param {function(err)} callback Callback to be called when the
 *  operation completes.
 */
SessionStorage.remove = function (sessionOrToken, callback) {
  var ref = sessionsRef.child(getToken(sessionOrToken));
  FirebaseBackend.remove(ref, callback);
};

