// const fs = require('fs');

require('@nomiclabs/hardhat-waffle');

// const privateKey = fs.readFileSync('.secret').toString().trim();

module.exports = {
  networks: {
    // sepolia: {
    //   url: 'https://sepolia.infura.io/v3/24793f88b43641c6a5add5226ea55548',
    //   accounts: [privateKey],
    // },
    hardhat: {
      chainId: 1337,
    },
    // mumbai: {
    //   url: 'https://rpc-mumbai.maticvigil.com',
    //   accounts: [privateKey],
    // },
    // rinkeby: {
    //   url: 'https://rinkeby.infura.io/v3/bed4fdcc76bb4978a9a3103ef0946f64',
    //   accounts: [privateKey],
    // },
  },
  solidity: '0.8.4',
};
