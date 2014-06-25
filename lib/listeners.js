'use strict';

var BilletRequestListener = require('./listeners/billet-request');

function listeners() {
  console.log('MODULO: '+'listeners'); 
  BilletRequestListener.on();
}

/** Exposes the routes setter. */
exports = module.exports = listeners;