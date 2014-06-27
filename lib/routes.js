/**
 * Defines the routes for each endpoint.
 */
'use strict';

var BilletEndpoint = require('./endpoints/BilletEndpoint');

/**
 * Sets the routes to the endpoints in the given application.
 * @param {Object} app Application listening to the routes.
 */
function routes(app) {
  if (!app) {
    throw('Missing application');
  }

  app.get('/core/billet/verifyBilletStatus', BilletEndpoint.verifyBilletStatus());

  console.log('[Successfully configure routes]');  
}

/** Exposes the routes setter. */
exports = module.exports = routes;