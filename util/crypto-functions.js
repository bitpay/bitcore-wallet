'use strict';

var crypto = require('crypto');
var bitcore = require('bitcore-lib');
var ttyread = require('ttyread');

var exports = {};

exports.getPassphrase = function(callback) {
  ttyread('Enter passphrase: ', {silent: true}, callback);
};


exports.decryptSecret = function(opts) {
  var hashedPassphrase = exports.sha512KDF(opts.passphrase, opts.salt, opts.derivationOptions);
  if (hashedPassphrase) {
    opts.key = hashedPassphrase;
  }
  return exports.decrypt(opts);
};

exports.decrypt = function(opts) {
  if (!Buffer.isBuffer(opts.key)) {
    opts.key = new Buffer(opts.key, 'hex');
  }

  var secondHalf;

  if (opts.iv) {
    secondHalf = opts.iv.slice(0, 16);
  } else {
    secondHalf = opts.key.slice(32, 48); //AES256-cbc IV
  }

  var cipherText = new Buffer(opts.cipherText, 'hex');
  var firstHalf = opts.key.slice(0, 32); //AES256-cbc shared key
  var AESDecipher = crypto.createDecipheriv('aes-256-cbc', firstHalf, secondHalf);

  return Buffer.concat([AESDecipher.update(cipherText), AESDecipher.final()]).toString('hex');
};

exports.sha512KDF = function(passphrase, salt, derivationOptions) {
  if (!derivationOptions || derivationOptions.method !== 0 || !derivationOptions.rounds) {
    return;
  }
  var rounds =  derivationOptions.rounds || 1;

  if (!Buffer.isBuffer(salt)) {
    salt = new Buffer(salt, 'hex');
  }
  var derivation = Buffer.concat([new Buffer(''), new Buffer(passphrase), salt]);
  for(var i = 0; i < rounds; i++) {
    derivation = crypto.createHash('sha512').update(derivation).digest();
  }
  return derivation;
};

exports.diffTime = function(time) {
  var diff = process.hrtime(time);
  return (diff[0] * 1E9 + diff[1])/(1E9 * 1.0);
}

module.exports = exports;
