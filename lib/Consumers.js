'use strict';

var ConsultantSubscriptionConsumer = require('./consumers/ConsultantSubscriptionConsumer');

function consumers() {
  ConsultantSubscriptionConsumer.verifyNewSubscriptions();
  console.log('[Successfully initialize consumers]');
}

exports = module.exports = consumers;