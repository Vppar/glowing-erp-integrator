'use strict';

var ConsultantSubscriptionRequestWorker = require('./workers/ConsultantSubscriptionRequestWorker');

function workers() {
  ConsultantSubscriptionRequestWorker.verifyNewSubscriptions();
  console.log('[Successfully initialize workers]');
}

exports = module.exports = workers;