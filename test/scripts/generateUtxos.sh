#!/bin/bash

cli="$HOME/source/bwdb/node_modules/bitcore-node/bin/bitcoin-0.12.1/bin/bitcoin-cli"
datadir=$HOME/regtest_wallets
network=regtest
numOfUtxos=1000
maxBTC=2
currentAmount=0.0
opts="-datadir=${datadir}"

function getAddress() {
  cmd="$cli ${opts} getnewaddress"
  currentAddress=$(eval $cmd)
}

function getAmount() {
  currentAmount=$(expr $RANDOM % $maxBTC).$RANDOM
}

while [ "${numOfUtxos}" -gt 0 ]; do
  getAmount
  while [ "${currentAmount}" == 0.0 ]; do
    getAmount
  done
  getAddress
  sendcmd="$cli ${opts} sendtoaddress ${currentAddress} ${currentAmount}"
  eval $sendcmd
  gencmd="$cli ${opts} generate 1"
  eval $gencmd
  let numOfUtxos-=1
done

exit 0
