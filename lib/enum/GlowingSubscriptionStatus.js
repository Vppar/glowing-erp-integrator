(function () {
  'use strict';

  var SubscriptionStatus = {};

  exports = module.exports = SubscriptionStatus;

  SubscriptionStatus.INITIAL = 'INITIAL';
  SubscriptionStatus.CONSULTANT_VALID = 'CONSULTANT_VALID';
  SubscriptionStatus.CONSULTANT_INVALID = 'CONSULTANT_INVALID';
  SubscriptionStatus.PENDING_USER_ACTION = 'PENDING_USER_ACTION';
  SubscriptionStatus.FINISHED = 'FINISHED';

})();