'use strict';

var path = require('path');
var should = require('chai').should();
var expect = require('chai').expect;
var BitcoreWalletTransaction = require('../bin/wallet-create-transaction');
var Transaction = require('bitcore-lib').Transaction;

describe('BitcoreWalletTransaction', function() {
  var testDirPath = path.resolve(__dirname, './testdata');

  var tx;
  before(function() {
    tx = new BitcoreWalletTransaction({
      program: {
        args: [
          testDirPath + '/utxos.json',
          testDirPath + '/addresses.json',
          testDirPath + '/tmp/output.hex'
        ],
        maxTxSize: 1E4,
        maxSatoshis: 30 * 1E8
      }
    })
  });

  it('should set utxos from file', function() {
    tx._setUtxos();
    tx.utxos.length.should.equal(1);
  });

  it('should set addresses and amounts from file', function() {
    tx._setOutputAddressesAndAmounts();
    tx._addresses.length.should.equal(2);
  });

  it('should create object tx' , function() {
    tx._createTransaction();
    expect(tx.tx).to.be.an.instanceof(Transaction);
  });

  it('should add outputs', function() {
    tx._setOutputAddressesAndAmounts();
    tx._createTransaction();
    tx._addOutputs();
    tx.tx.outputs.length.should.equal(2);
  });

  it('should add inputs', function() {
    tx._createTransaction();
    tx._setUtxos();
    tx._addInputs();
    tx.tx.inputs.length.should.equal(1);
  });

  it('should detect if more input space is needed', function() {
    tx._setUtxos();
    tx._createTransaction();
    var utxo = tx.utxos[0];
    tx.maxTxSize = 73;
    tx._hasInputSpace(utxo).should.be.false;
  });

});
