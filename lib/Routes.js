/**
 * Defines the routes for each endpoint.
 */
'use strict';

var BilletsPaymentStatusProcessEndpoint = require('./endpoints/BilletsPaymentStatusProcessEndpoint');

/**
 * Sets the routes to the endpoints in the given application.
 * @param {Object} app Application listening to the routes.
 */
function routes(app) {
  if (!app) {
    throw('Missing application');
  }

  app.get('/subscriptions/handleBilletsPaymentStatusProcess', BilletsPaymentStatusProcessEndpoint.handleBilletsPaymentStatusProcess());

  console.log('[Successfully configure routes]');  
}

/** Exposes the routes setter. */
exports = module.exports = routes;