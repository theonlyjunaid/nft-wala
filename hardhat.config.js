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
    }
  },
  solidity: '0.8.4',
};
