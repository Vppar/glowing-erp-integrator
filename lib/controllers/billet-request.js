(function () {
  'use strict';

  var BilletRequestStorage = require('../storages/billet-request');

  var BilletRequestController = {};
  exports = module.exports = BilletRequestController;

  BilletRequestController.create = function (req, callback) {
  	console.log('TESTE3'+req.body);
	  BilletRequestStorage.save({
	    email : req.body.email,
	    cpf : req.body.cpf
	  }, callback);

	  return callback(null, req.body);
  };

})();