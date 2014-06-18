'use strict';

var BilletRequestService = {};
exports = module.exports = BilletRequestService;

var EmailService = require('../services/email');
var CustomerService = require('../services/customer-request');
var OrderService = require('../services/order-request');
var BilletRequestVPSAClient = require('../clients/billet-request-vpsa');

BilletRequestService.handleBilletRequest = function () {
  function handler(billetRequestSnapshot, prevBilletRequest) {  	
	//Validation (must have [cpf,endereço,etc])	
	//call customer service to create customer if necessary
	//call order service to create order
	//call billet client
	//call email service
  }
};