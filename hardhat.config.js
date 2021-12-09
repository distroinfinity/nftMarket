require("@nomiclabs/hardhat-waffle");
const fs = require('fs');


const privateKey = fs.readFileSync(".secret").toString();

const projectId = "AIjnKmG8wWjVKjh_BI4Ti-hc1jMFBBep";

module.exports = {
  networks: {
    hardhat: {
      chainId: 1337,
    },
    mumbai: {
      url: `https://rpc-mumbai.maticvigil.com`,
      accounts: [privateKey],
    },
  },
  solidity: "0.8.4",
};
