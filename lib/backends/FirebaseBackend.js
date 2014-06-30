
(function () {
  'use strict';

  var Config = require('../Config');
  var Firebase = require('firebase');
  var FirebaseBackend = {};
  
  exports = module.exports = FirebaseBackend;

  var baseRef = new Firebase(Config.firebase.URI);

  baseRef.auth(Config.firebase.SECRET, function (err) {
    if (err) {
      throw('Unable to authenticate to Firebase!', err);
    } else {
      // log authentication success
      console.log('[Successfully authenticated to Firebase]');
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
  
  FirebaseBackend.on = function (eventType, path, callback) {
    var ref = getRef(path);

    ref.on(
      eventType,

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

  FirebaseBackend.push = function (path, value, callback) {
    var ref = getRef(path);
    ref.push(value);   
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
