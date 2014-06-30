'use strict';

var Config = require('../Config');
var FirebaseBackend = require('../backends/FirebaseBackend');
var WorkQueue = require("./WorkQueue.js");

var consultantSubscriptionupdateQueueRef = FirebaseBackend.refs.base.child(Config.CONSULTANT_SUBSCRIPTION_UPDATE_QUEUE_REF);
var i = 0;

//TODO FIXME
var subscriptionConsultantUpdate = {};
subscriptionConsultantUpdate.newSubscriptionExpirationDate = 1383066000000;
subscriptionConsultantUpdate.consultantUUID = 3333;

setInterval(function() {
 	consultantSubscriptionupdateQueueRef.push(subscriptionConsultantUpdate);
 	i++;
}, config.NEW_WORK_PERIOD);