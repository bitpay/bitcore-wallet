'use strict';

var crypto = require('crypto');
var bitcore = require('bitcore-lib');
var ttyread = require('ttyread');

var exports = {};

exports.getPassphrase = function(callback) {
  ttyread('Enter passphrase: ', {silent: true}, callback);
};

exports.sha512KDF = function(passphrase, salt, derivationOptions, callback) {
  if (!derivationOptions || derivationOptions.method !== 0 || !derivationOptions.rounds) {
    return callback(new Error('SHA512 KDF method was called for, ' +
      'yet the derivations options for it were not supplied.'));
  }
  var rounds =  derivationOptions.rounds || 1;
  //if salt was sent in as a string, we will have to assume the default encoding type
  if (!Buffer.isBuffer(salt)) {
    salt = new Buffer(salt, 'hex');
  }
  var derivation = Buffer.concat([new Buffer(''), new Buffer(passphrase), salt]);
  for(var i = 0; i < rounds; i++) {
    derivation = crypto.createHash('sha512').update(derivation).digest();
  }
  callback(null, derivation);
};

exports.decryptPrivateKey = function(opts, callback) {
  exports.decryptSecret(opts, function(err, masterKey) {
    if(err) {
      return callback(err);
    }
    opts.cipherText = opts.pkCipherText;
    opts.key = masterKey;
    opts.iv = bitcore.crypto.Hash.sha256sha256(new Buffer(opts.pubkey, 'hex'));
    exports.decrypt(opts, function(err, privateKey) {
      if(err) {
        return callback(err);
      }
      callback(null, privateKey);
    });
  });
};

exports.decryptSecret = function(opts, callback) {
  exports.sha512KDF(opts.passphrase, opts.salt, opts.derivationOptions, function(err, hashedPassphrase) {
    if (err) {
      return callback(err);
    }
    opts.key = hashedPassphrase;
    exports.decrypt(opts, callback);
  });
};

exports.decrypt = function(opts, callback) {
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
  var plainText;
  try {
    plainText = Buffer.concat([AESDecipher.update(cipherText), AESDecipher.final()]).toString('hex');
  } catch(e) {
    return callback(e);
  }
  callback(null, plainText);
};

exports.confirm = function(question, callback) {
  ttyread(question + ' (y/N): ', function(err, answer) {
    if (err) {
      return callback(err, false);
    }
    if (answer === 'y') {
      return callback(null, true);
    }
    callback(null, false);
  });
};


module.exports = exports;
