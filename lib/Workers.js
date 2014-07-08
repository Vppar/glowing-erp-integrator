'use strict';

var ProcessNewSubscriptionsWorker = require('./workers/ProcessNewSubscriptionsWorker');

function workers() {
  ProcessNewSubscriptionsWorker.handle();
  console.log('[Successfully initialize workers]');
}

exports = module.exports = workers;