'use strict';
var VPSAClientUtils = {};
exports = module.exports = VPSAClientUtils;

VPSAClientUtils.verifyValidId = function(body){
	
	var bodyAsInt = null;
	try {
		bodyAsInt = parseInt(body);
	} catch(e) { 
		bodyAsInt = null;
	}

	if(typeof bodyAsInt == 'number' && bodyAsInt > 0) {
	   return bodyAsInt;  
	} else {
	   return null;      
	}
}