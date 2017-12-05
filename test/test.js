/* eslint-env node, mocha */
/* eslint-disable prefer-arrow-callback, no-shadow */

const chai = require('chai');
const request = require('request');
const JSON = require('../app/dev/jsonfn');
const server = require('../app/index.js');

const assert = chai.assert;
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
      request.get(`${HOST}gbn/`, (error, response) => {
        assert.ok(response.statusCode === 200);
        done();
      });
    });

    it('GET /<everythingelse> returns status code 404', function test(done) {
      this.timeout(TIMEOUT_TIME);
      request.get(`${HOST}gbn/alsdlasd`, (error, response) => {
        assert(response.statusCode === 404);
        done();
      });
    });

    describe('/c', function test() {
      it('GET / returns status code 200', function test(done) {
        this.timeout(TIMEOUT_TIME);
        request.get(`${HOST}gbn/c`, (error, response) => {
          assert.ok(response.statusCode === 200);
          done();
        });
      });

      it('GET something that exists', function test(done) {
        this.timeout(TIMEOUT_TIME);
        request.get(`${HOST}gbn/c/time`, (error, response, body) => {
          assert.ok(JSON.parse(body).name === 'time');
          done();
        });
      });

      it('GET something that doesn\'t exist, but a similar one does', function test(done) {
        this.timeout(TIMEOUT_TIME);
        request.get(`${HOST}gbn/c/clock`, (error, response, body) => {
          assert.ok(JSON.parse(body).name === 'time');
          done();
        });
      });

      it('GET something that doesn\'t exist has status code 418', function test(done) {
        this.timeout(TIMEOUT_TIME);
        request.get(`${HOST}gbn/c/blalasda`, (error, response) => {
          assert.ok(response.statusCode === 418);
          done();
        });
      });
    });

    describe('/f', function test() {
      it('GET / returns status code 200', function test(done) {
        this.timeout(TIMEOUT_TIME);
        request.get(`${HOST}gbn/f`, (error, response) => {
          assert.ok(response.statusCode === 200);
          done();
        });
      });

      it('GET something that exists', function test(done) {
        this.timeout(TIMEOUT_TIME);
        request.get(`${HOST}gbn/f/now`, (error, response, body) => {
          assert.ok(JSON.parse(body).name === 'now');
          done();
        });
      });

      it('GET something that doesn\'t exist has status code 418', function test(done) {
        this.timeout(TIMEOUT_TIME);
        request.get(`${HOST}gbn/f/blalasda`, (error, response) => {
          assert.ok(response.statusCode === 418);
          done();
        });
      });
    });

    describe('/r', function test() {
      it('GET / returns status code 200', function test(done) {
        this.timeout(TIMEOUT_TIME);
        request.get(`${HOST}gbn/r`, (error, response) => {
          assert.ok(response.statusCode === 200);
          done();
        });
      });

      it('GET something that exists', function test(done) {
        this.timeout(TIMEOUT_TIME);
        request.get(`${HOST}gbn/r/unitConversion`, (error, response, body) => {
          assert.ok(JSON.parse(body).name === 'unitConversion');
          done();
        });
      });

      it('GET something that doesn\'t exist has status code 418', function test(done) {
        this.timeout(TIMEOUT_TIME);
        request.get(`${HOST}gbn/r/blalasda`, (error, response) => {
          assert.ok(response.statusCode === 418);
          done();
        });
      });
    });
  });

  describe('/gbm', function test() {
    it('GET / returns status code 200', function test(done) {
      this.timeout(TIMEOUT_TIME);
      request.get(`${HOST}gbm/`, (error, response) => {
        assert.ok(response.statusCode === 200);
        done();
      });
    });

    it('GET /<everythingelse> returns status code 404', function test(done) {
      this.timeout(TIMEOUT_TIME);
      request.get(`${HOST}gbm/alsdlasd`, (error, response) => {
        assert(response.statusCode === 404);
        done();
      });
    });

    describe('/search', function test() {
      it('GET / returns status code 200', function test(done) {
        this.timeout(TIMEOUT_TIME);
        request.get(`${HOST}gbm/search`, (error, response) => {
          assert.ok(response.statusCode === 200);
          done();
        });
      });

      it('GET /<everythingelse> returns status code 404', function test(done) {
        this.timeout(TIMEOUT_TIME);
        request.get(`${HOST}gbm/search/alsdlasd`, (error, response) => {
          assert(response.statusCode === 404);
          done();
        });
      });

      it('POST / returns a function if it exists', function test(done) {
        this.timeout(TIMEOUT_TIME);
        request.post({ uri: `${HOST}gbm/search`, form: { outputNodes: ['time'] } }, (error, response, body) => {
          assert.ok(JSON.parse(body)[0].function === 'now.js');
          done();
        });
      });

      it('POST / returns returns status code 418 if it can\'t find a function', function test(done) {
        this.timeout(TIMEOUT_TIME);
        request.post({ uri: `${HOST}gbm/search`, form: { outputNodes: ['days'] } }, (error, response) => {
          assert(response.statusCode === 418);
          done();
        });
      });
    });
  });

  describe('/cbm', function test() {
    it('GET / returns status code 200', function test(done) {
      this.timeout(TIMEOUT_TIME);
      request.get(`${HOST}cbm/`, (error, response) => {
        assert.ok(response.statusCode === 200);
        done();
      });
    });

    it('GET /<everythingelse> returns status code 404', function test(done) {
      this.timeout(TIMEOUT_TIME);
      request.get(`${HOST}cbm/alsdlasd`, (error, response) => {
        assert(response.statusCode === 404);
        done();
      });
    });

    describe('/call', function test() {
      it('GET / returns status code 200', function test(done) {
        this.timeout(TIMEOUT_TIME);
        request.get(`${HOST}cbm/call`, (error, response) => {
          assert.ok(response.statusCode === 200);
          done();
        });
      });

      it('GET /<everythingelse> returns status code 404', function test(done) {
        this.timeout(TIMEOUT_TIME);
        request.get(`${HOST}cbm/call/alsdlasd`, (error, response) => {
          assert(response.statusCode === 404);
          done();
        });
      });

      it('POST / can retrieve a function with given arguments if it is in DB (with same units)', function test(done) {
        this.timeout(TIMEOUT_TIME);
        request.post({ uri: `${HOST}cbm/call`, form: { outputNodes: ['time'], outputUnits: ['milliseconds'] } }, (error, response, body) => {
          // eslint-disable-next-line
          assert.ok(JSON.parse(body) == eval(JSON.parse(body)));
          done();
        });
      });

      it('POST / can retrieve a function with given arguments if it is in DB (with different units)', function test(done) {
        this.timeout(TIMEOUT_TIME);
        request.post({ uri: `${HOST}cbm/call`, form: { outputNodes: ['time'], outputUnits: ['hours'] } }, (error, response, body) => {
          // eslint-disable-next-line
          assert.ok(JSON.parse(body) == eval(JSON.parse(body)));
          done();
        });
      });

      it('POST / can retrieve a function\'s code if returncode = true', function test(done) {
        this.timeout(TIMEOUT_TIME);
        request.post({ uri: `${HOST}cbm/call`, headers: { returncode: true }, form: { outputNodes: ['time'], outputUnits: ['hours'] } }, (error, response, body) => {
          assert.ok(JSON.parse(body).function === 'now.js');
          done();
        });
      });

      it('POST / returns status 418 if it can\'t find a function in the DB', function test(done) {
        this.timeout(TIMEOUT_TIME);
        request.post({ uri: `${HOST}cbm/call`, headers: { returncode: true }, form: { outputNodes: ['bla'], outputUnits: ['seconds'] } }, (error, response) => {
          assert(response.statusCode === 418);
          server.close();
          done();
        });
      });
    });
  });
});
