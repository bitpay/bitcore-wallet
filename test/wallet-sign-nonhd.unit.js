'use strict';

var path = require('path');
var should = require('chai').should();
var expect = require('chai').expect;
var exec = require('child_process').exec;
var fs = require('fs');

describe.only('Apply signatures to a raw transaction', function() {
  var testDirPath = path.resolve(__dirname, './testdata');

  it('should, given a non-hd wallet, sign a tranaction based on an input file', function(done) {
    exec(__dirname + '/../bin/wallet-sign-nonhd', function(err, stdout, stderr) {
      if(err) {
        return done(err);
      }
      stderr.should.be.null;


    });
  });

});
