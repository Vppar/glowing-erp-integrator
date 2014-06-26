var expect = require('chai').expect;

var MODULE_PATH = '../../../lib/listeners';

describe('listeners module', function () {
  it('is accessible', function () {
    function requireModule() {
      require(MODULE_PATH);
    }

    expect(requireModule).not.to.throw;
  });

  it('exposes a function', function () {
    var listeners = require(MODULE_PATH);

    expect(listeners).to.be.a('function');
  });
});