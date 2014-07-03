(function () {
  'use strict';

  var GlowingSubscriptionStatus = {};

  exports = module.exports = GlowingSubscriptionStatus;

  GlowingSubscriptionStatus.INITIAL = 'INITIAL';
  GlowingSubscriptionStatus.CONSULTANT_VALID = 'CONSULTANT_VALID';
  GlowingSubscriptionStatus.CONSULTANT_INVALID = 'CONSULTANT_INVALID';
  GlowingSubscriptionStatus.ERROR = 'ERROR';
  GlowingSubscriptionStatus.PENDING_USER_ACTION = 'PENDING_USER_ACTION';
  GlowingSubscriptionStatus.PAYED_NOTIFIED = 'PAYED_NOTIFIED';
  GlowingSubscriptionStatus.FINISHED = 'FINISHED';

})();