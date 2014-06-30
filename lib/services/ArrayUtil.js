'use strict';

var ArrayUtil = {};
exports = module.exports = ArrayUtil;


ArrayUtil.filter = function ( list, filters ){
	var result = [];
	
	list.forEach(function(item) {
		filters.forEach(function(filter) {
			if( item[filter.field] === filter.value ){
				result.push(item);
			}
		});
	});

	return result;
}