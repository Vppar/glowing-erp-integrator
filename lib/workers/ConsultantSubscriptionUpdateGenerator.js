'use strict';

var Config = require('../Config');
var FirebaseBackend = require('../backends/FirebaseBackend');
var WorkQueue = require("./WorkQueue.js");
var ConsultantSubscriptionUpdateGenerator = {};

exports = module.exports = ConsultantSubscriptionUpdateGenerator;

var consultantSubscriptionUpdateQueueRef = FirebaseBackend.refs.base.child(Config.CONSULTANT_SUBSCRIPTION_UPDATE_QUEUE_REF);

ConsultantSubscriptionUpdateGenerator.updateConsultantExpirationDate = function (consultantUUID, newSubscriptionExpirationDate) {	
	var subscriptionConsultantUpdate = {};
	subscriptionConsultantUpdate.newSubscriptionExpirationDate = newSubscriptionExpirationDate;
	subscriptionConsultantUpdate.consultantUUID = consultantUUID;
	consultantSubscriptionUpdateQueueRef.push(JSON.stringify(subscriptionConsultantUpdate));
};