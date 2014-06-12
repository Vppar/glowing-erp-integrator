'use strict';

var EMAIL_TO_IDS_FIELD_NAME = '_ids';

var crypto = require('crypto');

var FirebaseBackend = require('../backends/firebase');
var RequestError = require('../enum/requestError');

var isEmail = require('../utils/isEmail');

var usersRef = FirebaseBackend.refs.base.child('user');
var idsRef = usersRef.child(EMAIL_TO_IDS_FIELD_NAME);


var UserStorage = {};
exports = module.exports = UserStorage;


// Encode an email address into something we can use in a Firebase path
function encodeEmail(email) {
  return crypto
    .createHash('sha1')
    .update(email)
    .digest('hex');
}


function createId() {
  return 'randomid' + Math.floor(Math.random() * 1000000001);
}


function getId(userOrId) {
  return userOrId && userOrId.id || userOrId;
}


UserStorage.getId = function (email, callback) {
  FirebaseBackend.get(idsRef.child(encodeEmail(email)), callback);
};


UserStorage.get = function (idOrEmail, callback) {
  if (idOrEmail === EMAIL_TO_IDS_FIELD_NAME) {
    // Protect the special field in the users object used to get an user's id
    // based on its email address.
    return callback({
      message : 'Invalid user: ' + idOrEmail,
      code : RequestError.INVALID_USER_ID
    }, null);
  }

  if (isEmail(idOrEmail)) {
    UserStorage.getId(idOrEmail, function (err, id) {
      // Something wrong happened
      if (err) { return callback(err, null); }

      // Could not resolve the e-mail address to an user's id
      if (!id) { return callback(null, null); }

      // User id found, get the user data
      UserStorage.get(id, callback);
    });
  } else {
    // `idOrEmail` is an id
    FirebaseBackend.get(usersRef.child(idOrEmail), callback);
  }
};


UserStorage.save = function (user, callback) {
  var id = createId();

  usersRef.child(id).transaction(function (current) {
    if (!current) {
      user.id = id;
      return user;
    } else {
      // Id already in use, try again and abort current transaction.
      UserStorage.save(user, callback);
    }
  }, function (err, committed) {
    if (err) {
      return callback(err, null);
    }
    
    if (committed) {
      UserStorage.setEmailToId(user.email, id, function (err) {
        if (err) {
          return callback(err, null);
        }

        callback(null, user);
      });
    }
  });
};


UserStorage.setEmailToId = function (email, id, callback) {
  // We use an email hash instead of the e-mail itself because of Firebase's
  // character restrictions for its resource paths. This is more reliable than
  // replacing dots with underscores as we were doing until now.
  idsRef.child(encodeEmail(email)).set(id, callback);
};


UserStorage.update = function (userOrId, update, callback) {
  var id = getId(userOrId);
  update.updated = new Date().getTime();

  FirebaseBackend.update(usersRef.child(id), update, callback);
};


UserStorage.remove = function (userOrId, callback) {
  // TODO
  callback(null, null);
};
