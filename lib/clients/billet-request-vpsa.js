//POST PUT GET to VPSA (billet opertions)

'use strict';

var BilletRequestVPSAClient = {};
exports = module.exports = BilletRequestVPSAClient;

BilletRequestVPSAClient.requestBilletGenerationToVPSA = function(billetRequestSnapshot, callback) {
	callback(null, '[BilletRequestVPSAClient.requestBilletGenerationToVPSA OK]');
};

BilletRequestVPSAClient.getBilletBytesFromVPSA = function(billetRequestSnapshot, callback) {
	callback(null, '[BilletRequestVPSAClient.getBilletBytesFromVPSA OK]');
};

BilletRequestVPSAClient.verifyBilletStatus = function (billetRequestSnapshot, callback) {
	callback(null, '[BilletRequestVPSAClient.verifyBilletStatus OK]');
};