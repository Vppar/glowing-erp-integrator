'use strict';

var FirebaseBackend = require('../backends/firebase');
var billetRequestRef = FirebaseBackend.refs.base.child('pending/subscriptionAdd');
var BilletRequestController = require('../controllers/billet-request');

var BilletRequestListener = {};
exports = module.exports = BilletRequestListener;

BilletRequestListener.on = function () {
	FirebaseBackend.on('child_added', billetRequestRef, function(err, billetRequestSnapshot) {
		if(err) {
			console.log(err);
			return;
		}
	    BilletRequestController.handleBilletRequest(billetRequestSnapshot, function(err, results) {	    	
	    	if(err) {
	    		console.log('[BilletRequestListener.handleBilletRequest err '+err+']');
				return;
			} else {
				console.log('[BilletRequestListener.handleBilletRequest results '+results+']');
			}
	    });
	});
};