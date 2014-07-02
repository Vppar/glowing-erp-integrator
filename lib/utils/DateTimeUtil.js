'use strict';
var DateTimeUtil = {};
exports = module.exports = DateTimeUtil;

DateTimeUtil.getCurrentDate = function(){
	var currentDate = new Date();

	var dia = currentDate.getDate();
	var mes = currentDate.getMonth();
	
	if(dia < 10){
		dia = '0' + dia;
	}

	if(mes < 10){
		mes = '0' + mes;
	}
	return dia + '-' + mes + '-' + currentDate.getFullYear();
}

DateTimeUtil.getCurrentHour = function(){
	var currentHour = new Date();
	return currentHour.getHours() + ':' + currentHour.getMinutes() + ':' + currentHour.getSeconds();
}