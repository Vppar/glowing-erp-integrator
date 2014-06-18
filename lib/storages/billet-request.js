'use strict';

var FirebaseBackend = require('../backends/firebase');
var billetRequestRef = FirebaseBackend.refs.base.child('billetRequest');

var BilletRequestStorage = {};
exports = module.exports = BilletRequestStorage;

BilletRequestStorage.save = function (billetRequest, callback) {
  FirebaseBackend.set(billetRequestRef, billetRequest, null, callback);
};

BilletRequestStorage.get = function (billetRequest, callback) {
  FirebaseBackend.get(billetRequest, callback);
};