'use strict';

var CustomerService = require('../../../lib/services/CustomerService');
var CustomerVPSAClient = require('../../../lib/clients/vpsa/CustomerVPSAClient');
var expect = require('chai').expect;
var should = require('chai').should();
var sinon  = require('sinon');
var customerValid = {};

describe('Service: CustomerServiceScenario', function() {
	
	beforeEach(function() { 
		customerValid = {
			nome: 'Customer Name 2',
			documento: '585.872.378-02',
			enderecos: [{ tipo: 'AVENIDA', logradouro: 'logradouro teste', numero: '45', bairro: 'bairro teste', cep: '12328460', codigoIBGECidade: '3549904'}]
		}	
	});
	
	xit('getByDocument: should call CustomerVPSAClient.getByDocument once', function(done){
		
		var stub = sinon.stub(CustomerVPSAClient, 'getByDocument').returns('teste867867');
		
		CustomerService.getByDocument(1, '583.235.776-09', function(){});
		
		expect(stub.calledOnce).to.be.true;
		
		done();
	})
	
	xit('getByDocument: should get error message callback when document is empty or not type of string', function(done){
		CustomerService.getByDocument(1, null, function(err, result){
			should.exist(err);
			expect(result).to.be.undefined;
			expect(err).to.equal('[CustomerService.getByDocument][Subscription: 1][Error: customerDocument parameter is invalid]');
		});
		
		CustomerService.getByDocument(1, 10, function(err, result){
			should.exist(err);
			expect(result).to.be.undefined;
			expect(err).to.equal('[CustomerService.getByDocument][Subscription: 1][Error: customerDocument parameter is invalid]');
		});
		
		CustomerService.getByDocument(1, 10.2, function(err, result){
			should.exist(err);
			expect(result).to.be.undefined;
			expect(err).to.equal('[CustomerService.getByDocument][Subscription: 1][Error: customerDocument parameter is invalid]');
		});
		
		CustomerService.getByDocument(1, true, function(err, result){
			should.exist(err);
  			should.not.exist(result);
  			expect(result).to.be.undefined;
  			expect(err).to.equal('[CustomerService.getByDocument][Subscription: 1][Error: customerDocument parameter is invalid]');
		});
		done();
	})
	
	xit('create: should call CustomerVPSAClient.create once', function(done){
		var stub = sinon.stub(CustomerVPSAClient, 'create').returns('teste867867');
		
		CustomerService.create(1, customerValid, function(){});
		
		expect(stub.calledOnce).to.be.true;
		
		done();
	})
	
	xit('create: should get error message callback when customer is empty', function(done){
		CustomerService.create(1, null, function(err, result){
			expect(err).not.to.be.null;
			expect(result).to.be.undefined;
			expect(err).to.be.equal('[CustomerService.create][Subscription: 1][Error: NewCustomer parameter is empty]');
			done();
		})
	})
	
	xit('create: should get error message callback when customer doesnt have name, document or address', function(done){
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
	
	it('mergeCustomer: should get error message callback method when consultant is empty', function(done) {
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
	
	it('mergeCustomer: should create a new customer when it doesnt exists in vpsa', function(done) {
		var subscription = {
			uuid: 1,
			snapshot: { 
				consultant: {
					name: 'unit test',
					cpf: '815.311.380-12',
					emailPrimer: 'unitteste@test.com',
					email: 'unitteste2@test.com',
					cep: '12328460',
					phone: '1239548772',
					cellphone: '1239640123',
					address: [{
						street: 'avenida dom pedro',
						number: '1010'
					}]
			}}
		};
		
		CustomerService.mergeCustomer(subscription, function(err, result) {
			console.log(result);
			
			expect(result).not.to.be.null;
			expect(err).to.be.null;
		
			done();
		});
	})
	
	//TODO: mock
	xit('mergeCustomer : should update the customer when it exists in vpsa', function(done) {
		var subscription = {
				uuid: 1,
				snapshot: { 
					consultant: {
						name: 'unit test 2',
						cpf: '815.311.380-12',
						emailPrimer: 'unitteste2@test.com',
						email: 'unitteste2@test.com',
						phone: '1239548772',
						cellphone: '1239640123',
						cep:'12328460',
						address: {
							street: 'avenida dom pedro 2',
							number: '2020'
						}
				}}
			};
			
			CustomerService.mergeCustomer(subscription, function(err, result) {
				expect(result).not.to.be.null;
				expect(err).to.be.null;
			
				done();
			});
	})
});





