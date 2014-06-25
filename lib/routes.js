/**
 * Defines the routes for each endpoint.
 */

'use strict';

var SessionEndpoint = require('./endpoints/session');
var BilletRequestEndpoint = require('./endpoints/billet-request');

/**
 * Sets the routes to the endpoints in the given application.
 * @param {Object} app Application listening to the routes.
 */
function routes(app) {
  if (!app) {
    throw('Missing application');
  }

  app

  	/*
    SESSION ROUTES
    */
    .post('/core/session', SessionEndpoint.create())
    .get('/core/session', SessionEndpoint.getData())
    .delete('/core/session', SessionEndpoint.end())
    .post('/core/session/refresh', SessionEndpoint.refresh())
    .get('/core/billet-request/verifyBilletStatus', BilletRequestEndpoint.verifyBilletStatus());

  console.log('[Successfully configure routes]');  
}

/** Exposes the routes setter. */
exports = module.exports = routes;