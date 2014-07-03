(function () {
  'use strict';

  var GlowingSubscriptionStatus = {};

  exports = module.exports = GlowingSubscriptionStatus;

  GlowingSubscriptionStatus.INITIAL = 'INITIAL';
  GlowingSubscriptionStatus.CONSULTANT_VALID = 'CONSULTANT_VALID';
  GlowingSubscriptionStatus.CONSULTANT_INVALID = 'CONSULTANT_INVALID';
  GlowingSubscriptionStatus.PENDING_USER_ACTION = 'PENDING_USER_ACTION';
  GlowingSubscriptionStatus.FINISHED = 'FINISHED';

})();