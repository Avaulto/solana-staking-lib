# Easy staking validator service

this module allow any validator to give easy staking integration for their users

## how does it work?
1. connect a wallet
2. allocate amount of sol from wallet account
3. create new stake account with allocated SOL
4. delegate SOL to configured vote-account
5. done


## how to use

setup your validator vote account, network env, validator name on .env file. <br/>
example:
```

REACT_APP_VOTE_ADDRESS=87QuuzX6cCuWcKQUFZFm7vP9uJ72ayQD5nr6ycwWYWBG
REACT_APP_NETWORK=testnet
REACT_APP_VALIDATOR_NAME=Avaulto
```
and run:
```
npm start
```
**Note: app not audited - use at your own risk!**

# for supported wallets check:
https://www.npmjs.com/package/@project-serum/sol-wallet-adapter

