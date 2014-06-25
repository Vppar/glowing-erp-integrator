'use strict';

var FirebaseBackend = require('../backends/firebase');
var billetRequestRef = FirebaseBackend.refs.base.child('billetRequest');
var BilletRequestController = require('../controllers/billet-request');

var BilletRequestListener = {};
exports = module.exports = BilletRequestListener;

BilletRequestListener.on = function () {
	console.log('MODULO: '+'BilletRequestListener.on');
	FirebaseBackend.on('child_added', billetRequestRef, function(err, billetRequestSnapshot) {
		console.log('MODULO: '+'BilletRequestListener.FirebaseBackend.on');
		if(err) {
			console.log('MODULO: '+'BilletRequestListener.FirebaseBackend.on err '+err);
			console.log(err);
			return;
		}
	    BilletRequestController.handleBilletRequest(billetRequestSnapshot, function(err, results) {	    	
	    	console.log('MODULO: '+'BilletRequestListener.handleBilletRequest snapshot:'+billetRequestSnapshot);
	    	if(err) {
	    		console.log('MODULO: '+'BilletRequestListener.handleBilletRequest err '+err);
				console.log(err);
				return;
			} else {
				console.log('MODULO: '+'BilletRequestListener.handleBilletRequest success');
				console.log(results);
			}
	    });
	});
};