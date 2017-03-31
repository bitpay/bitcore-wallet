# Non-HD Wallets Information

## Motivation

It is difficult to work with a collection of private keys in, or outside, Bitcoin Core's wallet. Tracking UTXO's, generating historical transaction information and maintaining security is a challenge. The set of tools located within this project will allow you to manage keys in a wallet and perform the aforementioned tasks.


## Workflow with respect to an existing "wallet.dat" file (Bitcoin Core's standard binary wallet file).

* Exporting encrypted private keys from a wallet.dat
* Creating a JSON-based wallet file analogous to wallet.dat
* Registering a server-based wallet instance
* Uploading addresses from your new wallet json file
* Gathering Unspent Transaction Outputs from your wallet
* Gathering transaction lists for your wallet keys
* Estimating fees for new transactions
* Generating new transactions based on unspent output data from your wallet
* Signing new transactions
* Broadcasting newly signed transactions

## Exporting encrypted private keys from a wallet.dat file to JSON format

* All commands should be issued from the root project directory (e.g. /home/user/bitcore-wallet)

```bash
$ ./bin/wallet-import-berkeley -f /home/user/wallet.dat wallet.json
```

## Creating a JSON wallet file

* Once wallet-import-berkeley is run, a file will be written that has all the necessary info for later commands
* Pay close attention to this wallet.json file, it has encrypted data from your bitcoin wallet.
* Any new information added to the old wallet.dat file from Bitcoin Core will necessitate a new import.

## Registering a new server-based wallet

```bash
$ ./bin/wallet-register -f wallet.json -u http://localhost:3001
```

* This procedure will read the "walletId" field from your wallet.json file and send it to bitcore-node for wallet creation.
* The walletId is a hashed version of your HDPublicKey created when your wallet.json was first created.
* WalletId's are globally unique.

## Uploading addresses to the server (bitcore-node)

```bash
$ ./bin/wallet-upload -f wallet.json -u http://localhost:3001
```

* Depending on the amount of addresses that your wallet file has, this procedure could take quite a while.
* A job ID is returned from this utility in order to allow your terminal to perform other work.
* You can check the job status any time by:

```bash
$ curl http://localhost:3001/wallet-api/jobs/<jobId>
```

## Gathering Unspent Outputs

```bash
$ ./bin/wallet-utxos -f wallet.json -u http://localhost:3001
```

## Estimating Fees

```bash
$ ./bin/estimate-fee
```

* This will give you the best estimates for having your transaction make it into a block within the next 2 blocks.

## Generating new transactions

```bash
$ ./bin/wallet.create-transaction --help
$ ./bin/wallet-create-transaction utxos.json unsigned.json
```

* You can create new transactions based on previously unspent outputs (UTXOs).
* There are lots of options for creating new transactions. Please refer to the help output.

## Signing new transactions

```bash
$ ./bin/wallet-sign-nohd -f wallet.json unsigned.json signed.json
```

* You will be asked for your pass phrased that you set on your Bitcoin Core wallet.dat file.
* Only the required private keys necessary for signing the transaction are decrypted.

## Broadcasting your signed transaction

```bash
$ ./bin/wallet-transaction-broadcast -u http://localhost:3001
```

* This will serialize your signed transaction and send it to the Bitcoin network via the url proxy.

