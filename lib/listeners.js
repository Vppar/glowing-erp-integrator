'use strict';

var BilletRequestListener = require('./listeners/billet-request');

function listeners() {
  console.log('[Starting listeners service...]');
  BilletRequestListener.on();
}

/** Exposes the routes setter. */
exports = module.exports = listeners;