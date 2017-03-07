'use strict';

var should = require('chai').should();
var expect = require('chai').expect;
var exec = require('child_process').exec
var path = require('path');

describe('wallet-transaction-broadcast', function() {
  var testdata = path.resolve(__dirname, './testdata');
  var bin = testdata + '/../../bin/wallet-transaction-broadcast';

  it('should not broadcast a tx over 100kb', function(done) {
    var options = testdata + '/largeTx.json';
    exec(bin + ' ' + options, function(err, stdout, stderr) {
      err.code.should.equal(1);
      expect(stderr).to.have.string('tx size too large to broadcast, limit, at the moment, is 100,000 bytes');
      expect(stdout).to.equal('');
      done();
    });
  });

  it('should not proceed without an input file', function(done) {
    exec(bin, function(err, stdout, stderr) {
      err.code.should.equal(1);
      expect(stderr).to.have.string('input file missing.');
      expect(stdout).to.equal('');
      done();
    });
  });

  it('should not proceed without a parsable input file', function(done) {
    var options = testdata + '/notjson.json';
    exec(bin + ' ' + options, function(err, stdout, stderr) {
      err.code.should.equal(1);
      expect(stderr).to.have.string('failed to parse file');
      expect(stdout).to.equal('');
      done();
    });
  });

  it('should not proceed without a tx file that has the right keys', function(done) {
    var options = testdata + '/badInputTx.json';
    exec(bin + ' ' + options, function(err, stdout, stderr) {
      err.code.should.equal(1);
      expect(stderr).to.have.string('Input keys are not correct');
      expect(stdout).to.equal('');
      done();
    });
  });

  it('should proceed to send a proper tx', function() {
    var options = testdata + '/signedTx.json';
    exec(bin + ' ' + options, function(err, stdout, stderr) {
      err.should.be.null;
      stderr.should.be.null;
      expect(stdout).to.equal('');
      done();
    });
  });
});

