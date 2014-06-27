'use strict';

var billetRequestRef = FirebaseBackend.refs.base.child('billetRequest');

var FirebaseBackend = require('../backends/FirebaseBackend');
var BilletStorage = {};

exports = module.exports = BilletStorage;

/*
BilletStorage.save = function (subscription, callback) {
  FirebaseBackend.set(billetRequestRef, billetRequest, null, callback);
};

BilletStorage.get = function (subscription, callback) {
  FirebaseBackend.get(billetRequest, callback);
};
*/