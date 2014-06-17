(function () {
  'use strict';

  var HttpStatus = require('../enum/httpStatus');

  exports = module.exports = function (options) {
    console.log('TESTE6');
    options = options || {};

    var sessionProperty = options.sessionProperty || 'session';

    return function (req, res, next) {
      console.log('TESTE7');
      var session = req[sessionProperty];

      /*if (!session) {
        res.json(HttpStatus.UNAUTHORIZED, {
          message : 'Authentication required',
          code : 'AUTHENTICATION_REQUIRED'
        });

        return;
      }*/

      next();
    };
  };
})();
