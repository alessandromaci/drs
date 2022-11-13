# [Decentralized Rating System](https://drs-bice.vercel.app/) [![Connect](https://img.shields.io/twitter/url/http/shields.io.svg?style=social&logo=twitter)](https://twitter.com/alerex_eth)



![version](https://img.shields.io/badge/version-1.1.0-blue.svg)

[Live Demo](https://drs-bice.vercel.app/)

## About
The protocol enables registered users to rate and being rated. The rating can be useful for example to identify good & bad actors in the network. There are two main use-case associated with the protocol:

- Rate users for their on-chain activity => The users' activty can be viewved via tx hash. The protocol takes two inputs (i.e. address of the user to rate and tx hash) and allows to specify a rating between 0-100.

- Rate ENS users => This interface instead allows users to only rate other users that own an ENS domain. The rating can be specified between 0-100 


### Pre-requisite

- NodeJs >= 14.x
- NextJs 12.x
- Solidity latest
- Alchemy API key
- EthersJs v5.x
- Metamask


## Contracts

[📚 DRS ENS - Goerli](https://goerli.etherscan.io/address/0xfE5dEb7Db9F5158f5AD3A2Eb7354c10e3B45B0F4)  
[📚 DRS Hash - Goerli](https://goerli.etherscan.io/address/0xc82A04B48d715A0f0C33b3f197e7e5BfC20F6436)

### Dev Environemnt

0. Install [Metamask](https://metamask.io)

1. Register account in [Alchemy](https://auth.alchemyapi.io/) and generate a new APP using Goerli network

2. Make `.env.local`

```shell
touch .env.local
```

add environment variable

```text
NEXT_PUBLIC_ALCHEMY_KEY= https://eth-goerli.alchemyapi.io/{YOUR_KEY}
```

3. Install dependencies

```bash
npm install --legacy-peer-deps
```

4. Start developmment

```bash
npm run dev
```

5. 📱 Open http://localhost:3000 to see the app

### Production

Live deployment is made via Github / Vercel integration, as a vercel.app, from master branch.


