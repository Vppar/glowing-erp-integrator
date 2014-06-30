'use strict';

var Config = require('../Config');
var Parameters = require('../middlewares/Parameters');
var HttpStatus = require('../enum/HttpStatus');
var RequestError = require('../enum/RequestError');
var BilletController = require('../controllers/BilletController');
var BilletEndpoint = {};

exports = module.exports = BilletEndpoint;

BilletEndpoint.verifyBilletStatus = function () {
	BilletController.verifyBilletStatus({}, function(err,result){
		console.log(err +" "+ result);
	});
};