#!/bin/bash

minerDatadir=$HOME/.bitcore/data
clientDatadir="$HOME/Library/Application Support/Bitcoin"
network=regtest
numOfUtxos=1000
maxBTC=2
currentAmount=0.0
minerOpts="-datadir=${minerDatadir} -${network}"
clientOpts="-datadir=\"${clientDatadir}\" -${network}"

function getAddress() {
  cmd="bitcoin-cli ${clientOpts} getnewaddress"
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
  sendcmd="bitcoin-cli ${minerOpts} sendtoaddress ${currentAddress} ${currentAmount}"
  eval $sendcmd
  gencmd="bitcoin-cli ${minerOpts} generate 1"
  eval $gencmd
  let numOfUtxos-=1
done

exit 0
