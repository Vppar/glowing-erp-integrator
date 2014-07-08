'use strict';

var CustomerService = require('../../../../lib/services/CustomerService');
var expect = require('chai').expect;
var should = require('chai').should();

var customerValid = {};

describe('Service: CustomerServiceScenario', function() {
	
	beforeEach(function() { 
		customerValid = {
			nome: 'Customer Name',
			documento: '600.867.912-14',
			emails: ['customername@teste.com']
			enderecos: [{ logradouro: 'logradouro teste', numero: 45, bairro: 'bairro teste', cep: '12328460', codigoIBGECidade: 3549904}],
			telefones: [{numero: '1239587489'}]
		}	
	});
	
	it('Should create a new customer', function(done){
		done();
	});
	
	//TODO: mock
	it('Should get a customer by document', function(done){
		CustomerService.getByDocument(001, '12.216.878/0009-03', function(err, result){
			should.not.exist(err);
  			should.exist(result);
  			result.should.be.an('object');
  			done();
		})
	});

	//TODO: mock
	it('Should get a empty object by document wrong', function(done){
		CustomerService.getByDocument(001, '12.216.878/0009-03', function(err, result){
			should.not.exist(err);
  			should.exist(result);
  			result.should.be.an('object');
  			done();
		})
	});
	
	
});