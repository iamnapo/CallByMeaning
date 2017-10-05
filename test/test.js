/* eslint-env node, mocha */

'use strict';

var chai = require('chai');
var assert = chai.assert;
var request = require('request');
var server = require('../app/index.js');
var base_url = 'http://localhost:3000/';

describe('CallByMeaning Server', function tests() {

  describe('Initial', function test() {

    it('GET / returns status code 200', function test(done) {
      this.timeout(2000);
      request.get(base_url, function (error, response) {
        assert.ok(response.statusCode === 200);
        done();
      });
    });

  });

  describe('/gbn', function test() {

    it('GET / returns status code 200', function test(done) {
      this.timeout(2000);
      request.get(base_url + 'gbn/', function (error, response) {
        assert.ok(response.statusCode === 200);
        done();
      });
    });

    it('GET /<everythingelse> returns status code 404', function test(done) {
      this.timeout(2000);
      request.get(base_url + 'gbn/alsdlasd', function (error, response) {
        assert(response.statusCode === 404);
        done();
      });
    });

    describe('/c', function test() {

      it('GET / returns status code 200', function test(done) {
        this.timeout(2000);
        request.get(base_url + 'gbn/c', function (error, response) {
          assert.ok(response.statusCode === 200);
          done();
        });
      });

      it('GET something that exists', function test(done) {
        this.timeout(2000);
        request.get(base_url + 'gbn/c/time', function (error, response, body) {
          assert.ok(JSON.parse(body).name === 'time');
          done();
        });
      });

      it('GET something that doesn\'t exist has status code 418', function test(done) {
        this.timeout(2000);
        request.get(base_url + 'gbn/c/blalasda', function (error, response) {
          assert.ok(response.statusCode === 418);
          done();
        });
      });

    });

    describe('/f', function test() {

      it('GET / returns status code 200', function test(done) {
        this.timeout(2000);
        request.get(base_url + 'gbn/f', function (error, response) {
          assert.ok(response.statusCode === 200);
          done();
        });
      });

      it('GET something that exists', function test(done) {
        this.timeout(2000);
        request.get(base_url + 'gbn/f/getTime', function (error, response, body) {
          assert.ok(JSON.parse(body).name === 'getTime');
          done();
        });
      });

      it('GET something that doesn\'t exist has status code 418', function test(done) {
        this.timeout(2000);
        request.get(base_url + 'gbn/f/blalasda', function (error, response) {
          assert.ok(response.statusCode === 418);
          done();
        });
      });

    });

    describe('/r', function test() {

      it('GET / returns status code 200', function test(done) {
        this.timeout(2000);
        request.get(base_url + 'gbn/r', function (error, response) {
          assert.ok(response.statusCode === 200);
          done();
        });
      });

      it('GET something that exists', function test(done) {
        this.timeout(2000);
        request.get(base_url + 'gbn/r/unitConversion', function (error, response, body) {
          assert.ok(JSON.parse(body).name === 'unitConversion');
          done();
        });
      });

      it('GET something that doesn\'t exist has status code 418', function test(done) {
        this.timeout(2000);
        request.get(base_url + 'gbn/r/blalasda', function (error, response) {
          assert.ok(response.statusCode === 418);
          done();
        });
      });

    });

  });

  describe('/gbm', function test() {

    it('GET / returns status code 200', function test(done) {
      this.timeout(2000);
      request.get(base_url + 'gbm/', function (error, response) {
        assert.ok(response.statusCode === 200);
        done();
      });
    });

    it('GET /<everythingelse> returns status code 404', function test(done) {
      this.timeout(2000);
      request.get(base_url + 'gbm/alsdlasd', function (error, response) {
        assert(response.statusCode === 404);
        done();
      });
    });

    describe('/search', function test() {

      it('GET / returns status code 200', function test(done) {
        this.timeout(2000);
        request.get(base_url + 'gbm/search', function (error, response) {
          assert.ok(response.statusCode === 200);
          done();
        });
      });

      it('GET /<everythingelse> returns status code 404', function test(done) {
        this.timeout(2000);
        request.get(base_url + 'gbm/search/alsdlasd', function (error, response) {
          assert(response.statusCode === 404);
          done();
        });
      });

      it('POST / returns a function if it exists', function test(done) {
        this.timeout(2000);
        request.post({uri: base_url + 'gbm/search', form: {'outputNodes': ['time'], 'outputUnits': ['seconds']}}, function (error, response, body) {
          assert.ok(JSON.parse(body).function === './js/getTime.js');
          done();
        });
      });

      it('POST / returns returns status code 418 if it can\'t find a function', function test(done) {
        this.timeout(2000);
        request.post({uri: base_url + 'gbm/search', form: {'outputNodes': ['days'], 'outputUnits': ['hours']}}, function (error, response) {
          assert(response.statusCode === 418);
          done();
        });
      });

    });

  });

  describe('/cbm', function test() {

    it('GET / returns status code 200', function test(done) {
      this.timeout(2000);
      request.get(base_url + 'cbm/', function (error, response) {
        assert.ok(response.statusCode === 200);
        done();
      });
    });

    it('GET /<everythingelse> returns status code 404', function test(done) {
      this.timeout(2000);
      request.get(base_url + 'cbm/alsdlasd', function (error, response) {
        assert(response.statusCode === 404);
        done();
      });
    });

    describe('/call', function test() {

      it('GET / returns status code 200', function test(done) {
        this.timeout(2000);
        request.get(base_url + 'cbm/call', function (error, response) {
          assert.ok(response.statusCode === 200);
          done();
        });
      });

      it('GET /<everythingelse> returns status code 404', function test(done) {
        this.timeout(2000);
        request.get(base_url + 'cbm/call/alsdlasd', function (error, response) {
          assert(response.statusCode === 404);
          done();
        });
      });

      it('POST / can retrieve a function with given arguments if it is in DB (with same units)', function test(done) {
        this.timeout(2000);
        request.post({uri: base_url + 'cbm/call', form: {'outputNodes': ['time'], 'outputUnits': ['seconds']}}, function (error, response, body) {
          assert.ok(JSON.parse(body) == eval(JSON.parse(body)));
          done();
        });
      });

      it('POST / can retrieve a function with given arguments if it is in DB (with different units)', function test(done) {
        this.timeout(2000);
        request.post({uri: base_url + 'cbm/call', form: {'outputNodes': ['time'], 'outputUnits': ['hours']}}, function (error, response, body) {
          assert.ok(JSON.parse(body) == eval(JSON.parse(body)));
          done();
        });
      });

      it('POST / can retrieve a function\'s code if returncode = true', function test(done) {
        this.timeout(2000);
        request.post({uri: base_url + 'cbm/call', headers: {returncode: true}, form: {'outputNodes': ['time'], 'outputUnits': ['hours']}}, function (error, response, body) {
          assert.ok(JSON.parse(body).function === './js/getTime.js');
          done();
        });
      });

      it('POST / returns status 418 if it can\'t find a function in the DB', function test(done) {
        this.timeout(2000);
        request.post({uri: base_url + 'cbm/call', headers: {returncode: true}, form: {'outputNodes': ['bla'], 'outputUnits': ['seconds']}}, function (error, response) {
          assert(response.statusCode === 418);
          server.close();
          done();
        });
      });

    });

  });

});