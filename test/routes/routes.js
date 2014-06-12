
var expect = require('chai').expect;

var MODULE_PATH = '../../lib/routes';


describe('routes module', function () {
  it('is accessible', function () {
    function requireModule() {
      require(MODULE_PATH);
    }

    expect(requireModule).not.to.throw;
  });

  it('exposes a function', function () {
    var routes = require(MODULE_PATH);

    expect(routes).to.be.a('function');
  });
}); // routes module


describe('routes()', function () {
  var express = require('express');
  var routes = require(MODULE_PATH);
  var app;


  beforeEach(function () {
    app = express();
  });


  it('is a function', function () {
    expect(routes).to.be.a('function');
  });


  it('sets routes in the given app object', function () {
    function getRouteStack() {
      return app._router && app._router.stack;
    }

    expect(getRouteStack()).to.be.undefined;

    routes(app);

    expect(getRouteStack()).to.be.defined;
    expect(getRouteStack().length).to.be.above(0);
  });


  it('throws an error if no app is given', function () {
    function routeWithoutApp() {
      routes();
    }

    expect(routeWithoutApp).to.throw('Missing application');
  });
}); // routes()

