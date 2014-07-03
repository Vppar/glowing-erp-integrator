(function () {
  'use strict';

  	//TODO FIXME Add mouths in expiration date and do another flow for 7 free days.
	var GlowingSubscriptionPlanType = {
	  SevenFREE: {name: 'SevenFREE', value: 1, addUp: 7, totalAmount: '00.00'},
	  GLOSS: 	 {name: 'GLOSS', value: 2, addUp: 186, totalAmount: '209.40'},
	  BLUSH: 	 {name: 'BLUSH', value: 3, addUp: 372, totalAmount: '358.80'},
	};

   exports = module.exports = GlowingSubscriptionPlanType;

})();