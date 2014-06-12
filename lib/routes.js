/**
 * Defines the routes for each endpoint.
 */

'use strict';

var SessionEndpoint = require('./endpoints/session');


/**
 * Sets the routes to the endpoints in the given application.
 * @param {Object} app Application listening to the routes.
 */
function routes(app) {
  if (!app) {
    throw('Missing application');
  }

  app
    .post('/core/session', SessionEndpoint.create())
    .get('/core/session', SessionEndpoint.getData())
    .delete('/core/session', SessionEndpoint.end())
    .post('/core/session/refresh', SessionEndpoint.refresh());

}


/** Exposes the routes setter. */
exports = module.exports = routes;
