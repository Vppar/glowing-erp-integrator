'use strict';

var FirebaseBackend = require('../backends/firebase');
var billetRequestRef = FirebaseBackend.refs.base.child('billetRequest');
var BilletRequestService = require('../services/billet-request');

var BilletRequestListener = {};
exports = module.exports = BilletRequestListener;

BilletRequestListener.on = function () {
  function handler(req, res) {
	FirebaseBackend.on(billetRequestRef, function(billetRequestSnapshot, prevBilletRequest) {
	  BilletRequestService.handleBilletRequest(billetRequestSnapshot, prevbilletRequest);
	});
  }
};