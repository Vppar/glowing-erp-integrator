(function () {
  'use strict';

  var GlowingBilletStatus = {};

  exports = module.exports = GlowingBilletStatus;

  GlowingBilletStatus.SENT = 'SENT';
  GlowingBilletStatus.CREATED = 'CREATED';
  GlowingBilletStatus.PAYED = 'PAYED';
  GlowingBilletStatus.NOT_PAYED = 'NOT_PAYED';
  GlowingBilletStatus.SHIPPED = 'SHIPPED';
  GlowingBilletStatus.INVALID = 'INVALID';
  GlowingBilletStatus.FINISHED = 'FINISHED';

})();