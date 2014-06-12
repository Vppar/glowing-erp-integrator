
(function () {
  'use strict';

  var config = require('../config');

  var Firebase = require('firebase');

  var FirebaseBackend = {};
  exports = module.exports = FirebaseBackend;

  var baseRef = new Firebase(config.FIREBASE_URI);

  baseRef.auth(config.FIREBASE_SECRET, function (err) {
    if (err) {
      throw('Unable to authenticate to Firebase!', err);
    } else {
      // log authentication success
      console.log('Successfully authenticated to Firebase');
    }
  });


  function getRef(path) {
    if (!path) {
      return baseRef;
    }

    // If path is not a string, consider it to be a reference object and
    // return it as is
    return typeof path === 'string' ? baseRef.child(path) : path;
  }


  FirebaseBackend.refs = {
    base : baseRef
  };


  FirebaseBackend.get = function (path, callback) {
    var ref = getRef(path);

    ref.once(
      'value',

      // handle value
      function (snapshot) {
        if (snapshot) {
          callback(null, snapshot.val());
          return;
        }

        callback(null, null);
      },

      // handle error
      function (err) {
        callback(err, null);
      }
    );
  };


  FirebaseBackend.set = function (path, value, priority, callback) {
    var ref = getRef(path);

    function onComplete(err) {
      if (err) {
        callback(err, null);
        return;
      }

      callback(null, value);
    }

    if (priority !== null) {
      ref.setWithPriority(value, priority, onComplete);
    } else {
      ref.set(value, onComplete);
    }
  };


  FirebaseBackend.remove = function (path, callback) {
    FirebaseBackend.set(path, null, null, callback);
  };


  FirebaseBackend.update = function (path, value, callback) {
    var ref = getRef(path);

    ref.update(value, function (err) {
      if (err) {
        callback(err, null);
        return;
      }

      callback(null, null);
    });
  };

})();
