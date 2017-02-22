var path = require('path');
var should = require('chai').should();
var expect = require('chai').expect;
var BitcoreWalletTransaction = require('../bin/wallet-create-transaction');
var Transaction = require('bitcore-lib').Transaction;
var rimraf = require('rimraf');
var mkdirp = require('mkdirp');
var fs = require('fs');

describe('BitcoreWalletTransaction', function() {

  var testDirPath = path.resolve(__dirname, './testdata');

  var tx;
  beforeEach(function(done) {
    initTestData(function(err) {
      if(err) {
        return done(err);
      }
      tx = new BitcoreWalletTransaction({
        program: {
          args: [
            testDirPath + '/input.json',
            testDirPath + '/tmp/output.hex'
          ],
          maxTxSize: 1E4,
          maxSatoshis: 30 * 1E8
        }
      });
      done();
    });
  });

  function initTestData(callback) {
    mkdirp(testDirPath + '/tmp', function(err) {
      if(err) {
        return callback(err);
      }
      rimraf(testDirPath + '/tmp/output.hex', function(err) {
        if(err) {
          return callback(err);
        }
        callback();
      });
    });
  }

  it('should get fees from a remote service', function(done) {
    tx._setInputInformation();
    tx._createTransaction();
    tx._addOutputs();
    tx._addInputs();
    tx._getFeePerByte(function(err) {
      if(err) {
        return done(err);
      }
      tx.tx.getFee().should.be.greaterThan(0);
      done();
    });
  });
});
