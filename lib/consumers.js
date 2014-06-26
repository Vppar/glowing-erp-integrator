'use strict';

var SubscriptionQueue = require('./consumers/subscription-queue');

function consumers() {
  SubscriptionQueue.consumer();
  console.log('[Successfully initialize consumers]');
}

exports = module.exports = consumers;