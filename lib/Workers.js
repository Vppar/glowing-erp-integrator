'use strict';

var ProcessNewSubscriptionsWorker = require('./workers/ProcessNewSubscriptionsWorker');

function workers() {
  ProcessNewSubscriptionsWorker.handle();
};

exports = module.exports = workers;