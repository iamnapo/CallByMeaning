/* eslint-env node, mocha */
/* eslint no-invalid-this: "off" */

'use strict';

const chai = require('chai');
const assert = chai.assert;
const request = require('request');
const JSON = require('../app/dev/jsonfn');
const server = require('../app/index.js');
const HOST = 'http://localhost:3000/';

const TIMEOUT_TIME = 3000;

describe('CallByMeaning Server', function tests() {
  describe('Initial', function done() {
    it('GET / returns status code 200', function test(done) {
      this.timeout(TIMEOUT_TIME);
      request.get(HOST, (error, response) => {
        assert.ok(response.statusCode === 200);
        done();
      });
    });
  });

  describe('/gbn', function test() {
    it('GET / returns status code 200', function test(done) {
      this.timeout(TIMEOUT_TIME);
      request.get(HOST + 'gbn/', function(error, response) {
        assert.ok(response.statusCode === 200);
        done();
      });
    });

    it('GET /<everythingelse> returns status code 404', function test(done) {
      this.timeout(TIMEOUT_TIME);
      request.get(HOST + 'gbn/alsdlasd', function(error, response) {
        assert(response.statusCode === 404);
        done();
      });
    });

    describe('/c', function test() {
      it('GET / returns status code 200', function test(done) {
        this.timeout(TIMEOUT_TIME);
        request.get(HOST + 'gbn/c', function(error, response) {
          assert.ok(response.statusCode === 200);
          done();
        });
      });

      it('GET something that exists', function test(done) {
        this.timeout(TIMEOUT_TIME);
        request.get(HOST + 'gbn/c/time', function(error, response, body) {
          assert.ok(JSON.parse(body).name === 'time');
          done();
        });
      });

      it('GET something that doesn\'t exist, but a similar one does', function test(done) {
        this.timeout(TIMEOUT_TIME);
        request.get(HOST + 'gbn/c/clock', function(error, response, body) {
          assert.ok(JSON.parse(body).name === 'time');
          done();
        });
      });

      it('GET something that doesn\'t exist has status code 418', function test(done) {
        this.timeout(TIMEOUT_TIME);
        request.get(HOST + 'gbn/c/blalasda', function(error, response) {
          assert.ok(response.statusCode === 418);
          done();
        });
      });
    });

    describe('/f', function test() {
      it('GET / returns status code 200', function test(done) {
        this.timeout(TIMEOUT_TIME);
        request.get(HOST + 'gbn/f', function(error, response) {
          assert.ok(response.statusCode === 200);
          done();
        });
      });

      it('GET something that exists', function test(done) {
        this.timeout(TIMEOUT_TIME);
        request.get(HOST + 'gbn/f/now', function(error, response, body) {
          assert.ok(JSON.parse(body).name === 'now');
          done();
        });
      });

      it('GET something that doesn\'t exist has status code 418', function test(done) {
        this.timeout(TIMEOUT_TIME);
        request.get(HOST + 'gbn/f/blalasda', function(error, response) {
          assert.ok(response.statusCode === 418);
          done();
        });
      });
    });

    describe('/r', function test() {
      it('GET / returns status code 200', function test(done) {
        this.timeout(TIMEOUT_TIME);
        request.get(HOST + 'gbn/r', function(error, response) {
          assert.ok(response.statusCode === 200);
          done();
        });
      });

      it('GET something that exists', function test(done) {
        this.timeout(TIMEOUT_TIME);
        request.get(HOST + 'gbn/r/unitConversion', function(error, response, body) {
          assert.ok(JSON.parse(body).name === 'unitConversion');
          done();
        });
      });

      it('GET something that doesn\'t exist has status code 418', function test(done) {
        this.timeout(TIMEOUT_TIME);
        request.get(HOST + 'gbn/r/blalasda', function(error, response) {
          assert.ok(response.statusCode === 418);
          done();
        });
      });
    });
  });

  describe('/gbm', function test() {
    it('GET / returns status code 200', function test(done) {
      this.timeout(TIMEOUT_TIME);
      request.get(HOST + 'gbm/', function(error, response) {
        assert.ok(response.statusCode === 200);
        done();
      });
    });

    it('GET /<everythingelse> returns status code 404', function test(done) {
      this.timeout(TIMEOUT_TIME);
      request.get(HOST + 'gbm/alsdlasd', function(error, response) {
        assert(response.statusCode === 404);
        done();
      });
    });

    describe('/search', function test() {
      it('GET / returns status code 200', function test(done) {
        this.timeout(TIMEOUT_TIME);
        request.get(HOST + 'gbm/search', function(error, response) {
          assert.ok(response.statusCode === 200);
          done();
        });
      });

      it('GET /<everythingelse> returns status code 404', function test(done) {
        this.timeout(TIMEOUT_TIME);
        request.get(HOST + 'gbm/search/alsdlasd', function(error, response) {
          assert(response.statusCode === 404);
          done();
        });
      });

      it('POST / returns a function if it exists', function test(done) {
        this.timeout(TIMEOUT_TIME);
        request.post({uri: HOST + 'gbm/search', form: {'outputNodes': ['time']}}, function(error, response, body) {
          assert.ok(JSON.parse(body)[0].function === 'now.js');
          done();
        });
      });

      it('POST / returns returns status code 418 if it can\'t find a function', function test(done) {
        this.timeout(TIMEOUT_TIME);
        request.post({uri: HOST + 'gbm/search', form: {'outputNodes': ['days']}}, function(error, response) {
          assert(response.statusCode === 418);
          done();
        });
      });
    });
  });

  describe('/cbm', function test() {
    it('GET / returns status code 200', function test(done) {
      this.timeout(TIMEOUT_TIME);
      request.get(HOST + 'cbm/', function(error, response) {
        assert.ok(response.statusCode === 200);
        done();
      });
    });

    it('GET /<everythingelse> returns status code 404', function test(done) {
      this.timeout(TIMEOUT_TIME);
      request.get(HOST + 'cbm/alsdlasd', function(error, response) {
        assert(response.statusCode === 404);
        done();
      });
    });

    describe('/call', function test() {
      it('GET / returns status code 200', function test(done) {
        this.timeout(TIMEOUT_TIME);
        request.get(HOST + 'cbm/call', function(error, response) {
          assert.ok(response.statusCode === 200);
          done();
        });
      });

      it('GET /<everythingelse> returns status code 404', function test(done) {
        this.timeout(TIMEOUT_TIME);
        request.get(HOST + 'cbm/call/alsdlasd', function(error, response) {
          assert(response.statusCode === 404);
          done();
        });
      });

      it('POST / can retrieve a function with given arguments if it is in DB (with same units)', function test(done) {
        this.timeout(TIMEOUT_TIME);
        request.post({uri: HOST + 'cbm/call', form: {'outputNodes': ['time'], 'outputUnits': ['milliseconds']}}, function(error, response, body) {
          assert.ok(JSON.parse(body) == eval(JSON.parse(body)));
          done();
        });
      });

      it('POST / can retrieve a function with given arguments if it is in DB (with different units)', function test(done) {
        this.timeout(TIMEOUT_TIME);
        request.post({uri: HOST + 'cbm/call', form: {'outputNodes': ['time'], 'outputUnits': ['hours']}}, function(error, response, body) {
          assert.ok(JSON.parse(body) == eval(JSON.parse(body)));
          done();
        });
      });

      it('POST / can retrieve a function\'s code if returncode = true', function test(done) {
        this.timeout(TIMEOUT_TIME);
        request.post({uri: HOST + 'cbm/call', headers: {returncode: true}, form: {'outputNodes': ['time'], 'outputUnits': ['hours']}}, function(error, response, body) {
          assert.ok(JSON.parse(body).function === 'now.js');
          done();
        });
      });

      it('POST / returns status 418 if it can\'t find a function in the DB', function test(done) {
        this.timeout(TIMEOUT_TIME);
        request.post({uri: HOST + 'cbm/call', headers: {returncode: true}, form: {'outputNodes': ['bla'], 'outputUnits': ['seconds']}}, function(error, response) {
          assert(response.statusCode === 418);
          server.close();
          done();
        });
      });
    });
  });
});