'use strict';
var StringUtils = {};
exports = module.exports = StringUtils;

StringUtils.removeAccents = function(str){
	
	var listToReplace=[
		 {accent:/[\xC0-\xC6]/g, letter:'A'},
		 {accent:/[\xE0-\xE6]/g, letter:'a'},
		 {accent:/[\xC8-\xCB]/g, letter:'E'},
		 {accent:/[\xE8-\xEB]/g, letter:'e'},
		 {accent:/[\xCC-\xCF]/g, letter:'I'},
		 {accent:/[\xEC-\xEF]/g, letter:'i'},
		 {accent:/[\xD2-\xD6]/g, letter:'O'},
		 {accent:/[\xF2-\xF6]/g, letter:'o'},
		 {accent:/[\xD9-\xDC]/g, letter:'U'},
		 {accent:/[\xF9-\xFC]/g, letter:'u'},
		 {accent:/[\xD1]/g, letter:'N'},
		 {accent:/[\xF1]/g, letter:'n'} 
	];
	 
	for(var i=0; i<listToReplace.length; i++) {
	 	str=str.replace(listToReplace[i].accent, listToReplace[i].letter);
	}

 	return str;
}