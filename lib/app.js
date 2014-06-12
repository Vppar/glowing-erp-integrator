(function () {
  /**
   * Defines and exposes a factory for creating application instances.
   */
  'use strict';

  var pkg = require('../package.json');

  var express = require('express');
  var bodyParser = require('body-parser');

  var config = require('./config');
  var routes = require('./routes');

  var token = require('./middlewares/token');


  /**
   * Initializes an instance of the REST API application.
   * @param {object?} options
   * @return {object}
   */
  function init() {
    var app = express();
    
    app.disable('x-powered-by');
    app.set('title', config.API_TITLE);
    app.set('name', pkg.name);
    app.set('version', pkg.version);

    app.use(bodyParser());

    // Sets the `token` property in the request object.
    app.use(token({
      query : config.TOKEN_QUERY_PARAM,
      property : config.SESSION_PROPERTY
    }));

    /** Creates the routes to the endpoints */
    routes(app);

    return app;
  }


  /** Exposes `Application` */
  exports = module.exports = init;

})();
