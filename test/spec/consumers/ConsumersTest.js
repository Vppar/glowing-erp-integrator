var expect = require('chai').expect;

var MODULE_PATH = '../../../lib/listeners';
var listeners = require(MODULE_PATH);
//var BilletRequestListener = require('./listeners/billet-request');

describe('listeners module', function () {
  it('is accessible', function () {
    function requireModule() {
      require(MODULE_PATH);
    }

    expect(requireModule).not.to.throw;
  });

  it('exposes a function', function () {   
  console.log('3333333333'+listeners); 
    expect(listeners).to.be.a('function');
  });

  //TODO
  xit('exposes a function', function () {
    listeners();
    expect(listeners).to.be.a('function');
  });

});