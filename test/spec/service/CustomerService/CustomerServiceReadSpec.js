var CustomerService = require('../../../../lib/services/CustomerService');
var assert = require('assert');

describe('Service: CustomerService', function() {
	
	it('should get a customer by document', function(done) {
		done();
		
		CustomerService.getByDocument('797.783.353-03', function(err, result){
			assert.equal(err, null);
			assert.notEqual(result, null);
		});
	});
	
	it('should get a result empty', function(done) {
		done();
		
		CustomerService.getByDocument('797.783.353-12', function(err, result){
			assert.equal(err, null);
			assert.notEqual(result, null);
			assert.equal(result, null);
		});
	});

	it('should return error passing document invalid', function(done) {
		done();
		
		CustomerService.getByDocument(null, function(err, result){
			assert.notEqual(err, null);
			assert.equal(result, null);
		});
		
		CustomerService.getByDocument(10101010101010, function(err, result){
			assert.notEqual(err, null);
			assert.equal(result, null);
		});
	});
});