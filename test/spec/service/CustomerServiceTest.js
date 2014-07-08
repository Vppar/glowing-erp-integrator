'use strict';

var CustomerService = require('../../../lib/services/CustomerService');
var expect = require('chai').expect;
var should = require('chai').should();

var customerValid = {};

describe('Service: CustomerServiceScenario', function() {
	
	beforeEach(function() { 
		customerValid = {
			nome: 'Customer Name',
			documento: '255.595.874-60',
			enderecos: [{ tipo: 'AVENIDA', logradouro: 'logradouro teste', numero: '45', bairro: 'bairro teste', cep: '12328460', codigoIBGECidade: '3549904'}]
		}	
	});
	
	//TODO: mock
	xit('Should get a customer by document', function(done){
		CustomerService.getByDocument(1, '12.216.878/0009-03', function(err, result){
			should.not.exist(err);
  			should.exist(result);
  			result.should.be.an('string');
  			
  			var obj = JSON.parse(result);
  			obj[0].should.be.an('object');
  			done();
		});
	})

	//TODO: mock
	xit('Should get a empty object when document not exists', function(done){
		CustomerService.getByDocument(1, '123', function(err, result){
			should.not.exist(err);
  			should.exist(result);
  			
  			var obj = JSON.parse(result);
  			expect(obj).to.be.empty;
  			done();
		});
	})
	
	//TODO: mock
	xit('Should get error message callback when document is empty or not type of string', function(done){
		CustomerService.getByDocument(1, null, function(err, result){
			should.exist(err);
			expect(result).to.be.undefined;
  			err.should.be.an('string');
		});
		
		CustomerService.getByDocument(1, 10, function(err, result){
			should.exist(err);
			expect(result).to.be.undefined;
  			err.should.be.an('string');
		});
		
		CustomerService.getByDocument(1, 10.2, function(err, result){
			should.exist(err);
			expect(result).to.be.undefined;
  			err.should.be.an('string');
		});
		
		CustomerService.getByDocument(1, true, function(err, result){
			should.exist(err);
  			should.not.exist(result);
  			expect(result).to.be.undefined;
  			err.should.be.an('string');
		});
		done();
	})
	
	//TODO: mock
	xit('Should create a new customer', function(done){
		CustomerService.create(1, customerValid, function(err, result){
			expect(err).to.be.null;
			expect(result).not.to.be.undefined;
			result.should.be.an('string');
			
			done();
		})		
	})
	
	xit('Should get error message callback when customer is empty', function(done){
		CustomerService.create(1, null, function(err, result){
			expect(err).not.to.be.null;
			expect(result).to.be.undefined;
			expect(err).to.be.equal('[CustomerService.create][Subscription: 1][Error: NewCustomer parameter is empty]');
			done();
		})
	})
	
	xit('Should get error message callback when customer doesnt have name, document or address', function(done){
		customerValid.nome = null;
		
		CustomerService.create(1, customerValid, function(err, result){
			expect(err).not.to.be.null;
			expect(result).to.be.undefined;
			expect(err).to.be.equal('[CustomerService.create][Subscription: 1][Error: Check the following attributes: nome, documento and enderecos]');
		})
		
		customerValid.nome = 'Customer Name';
		customerValid.documento = null;
		
		CustomerService.create(1, customerValid, function(err, result){
			expect(err).not.to.be.null;
			expect(result).to.be.undefined;
			expect(err).to.be.equal('[CustomerService.create][Subscription: 1][Error: Check the following attributes: nome, documento and enderecos]');
		})
		
		customerValid.nome = 'Customer Name';
		customerValid.documento = '255.595.874-60';
		customerValid.enderecos = null;
		
		CustomerService.create(1, customerValid, function(err, result){
			expect(err).not.to.be.null;
			expect(result).to.be.undefined;
			expect(err).to.be.equal('[CustomerService.create][Subscription: 1][Error: Check the following attributes: nome, documento and enderecos]');
		})
		
		done();
	})
	
	xit('Should get error message callback in mergeCustomer method when consultant is empty', function(done) {
		var subscription = {
			uuid: 1,
			snapshot: { consultant: null }
		};
		
		CustomerService.mergeCustomer(subscription, function(err, result) {
			expect(err).not.to.be.null;
			expect(result).to.be.undefined;
			expect(err).to.be.equal('[CustomerService.mergeCustomer][Subscription: 1][Error: Customer parameter is invalid]');
		})
		done();
	})
	
	//TODO: mock
	it('Should create a new customer in mergeCustomer method when it doesnt exists in vpsa', function(done) {
		
		setTimeout(done, 2000);
				
		var subscription = {
			uuid: 1,
			snapshot: { 
				consultant: {
					name: 'unit test',
					cpf: '332.328.226-49',
					emailPrimer: 'unitteste@test.com',
					email: 'unitteste2@test.com',
					cep: '12328460',
					phone: '1239548772',
					cellphone: '1239640123',
					address: {
						street: 'avenida dom pedro'
					}
			}}
		};
		
		CustomerService.mergeCustomer(subscription, function(err, result) {
			
			console.log(err);
			console.log(result);
			
			/*expect(err).to.be.null;
			expect(result).not.to.be.null;
			result.should.be.an('string');	*/
		
			;
		}).done();
	})
	
	//TODO: mock
	xit('Should update the customer in mergeCustomer method when it exists in vpsa', function(done) {
		var obj = {};
		
		CustomerService.getByDocument(1, '12.216.878/0009-03', function(err, result) {
			
				obj = JSON.parse(result);
				
				
				
				
				
				
				done();

		});
		
	})
});





