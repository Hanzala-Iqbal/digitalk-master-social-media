require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/lNqSBybKKolK6-W-hrib8Lmpwr4wcWhY",
      accounts: [process.env.PRIVATEKEY],
    },
  },
};
// npx hardhat run scripts/deploy.js --network sepolia

// https://eth-sepolia.g.alchemy.com/v2/lNqSBybKKolK6-W-hrib8Lmpwr4wcWhY

// 08acc607f75c3fad0c6f6cd61e052ceb43d16b489c7817969b12c3b7593e4628

// 0x9649086De31E21094e95ffa37B4A56437031e8dE

// DigiTalk is deployed Latest to 0x29acFA43C9114b2Fba26fe176ab0e952d698137f
