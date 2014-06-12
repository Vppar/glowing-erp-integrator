
(function () {
  'use strict';

  var HttpStatus = require('../enum/httpStatus');
  var RequestError = require('../enum/requestError');
  var UserController = require('../controllers/user');


  exports = module.exports = function (options) {
    options = options || {};

    var sessionProperty = options.sessionProperty || null;
    var userProperty = options.userProperty || 'user';

    if (!sessionProperty) {
      throw('Missconfigured: unable to check for a session!');
    }

    return function(req, res, next) {
      var session = req[sessionProperty];

      // No session information found
      if (!session) {
        next();
        return;
      }

      var userId = session.user;

      UserController.get(userId, function (err, user) {
        if (err) {
          res.json(HttpStatus.INTERNAL_SERVER_ERROR, {
            message : err.message,
            code : RequestError.SERVER_ERROR
          });
          return;
        }

        req[userProperty] = user;
        next();
      });
    };
  };
})();
