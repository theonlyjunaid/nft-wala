const fs = require('fs');

require('@nomiclabs/hardhat-ethers');

const privateKey = fs.readFileSync('.secret').toString().trim();

module.exports = {
  defaultNetwork: 'sepolia',
  networks: {
    sepolia: {
      url: 'https://eth-sepolia.g.alchemy.com/v2/phODLHFjD-NE7Sbr5FVltpGn90zE3DI8',
      accounts: [privateKey],
    },
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
