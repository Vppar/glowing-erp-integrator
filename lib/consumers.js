'use strict';

var SubscriptionConsultantRequestConsumer = require('./consumers/SubscriptionConsultantRequestConsumer');

function consumers() {
  SubscriptionConsultantRequestConsumer.consumer();
  console.log('[Successfully initialize consumers]');
}

exports = module.exports = consumers;