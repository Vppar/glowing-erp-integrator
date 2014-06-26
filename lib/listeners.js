'use strict';

var BilletRequestListener = require('./listeners/billet-request');

function listeners() {
  BilletRequestListener.on();
  console.log('[Successfully initialize listners]');
}

/** Exposes the routes setter. */
exports = module.exports = listeners;