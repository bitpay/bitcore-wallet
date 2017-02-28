#!/bin/bash



cli="$HOME/source/bwdb/node_modules/bitcore-node/bin/bitcoin-0.12.1/bin/bitcoin-cli"
datadir=$HOME/regtest_wallets
network=regtest
opts="-datadir=${datadir}"






cmd="$cli ${opts} getaddressesbyaccount \"\""
addresses=$(eval $cmd)


cmd="$cli ${opts} listunspent"
eval $cmd
