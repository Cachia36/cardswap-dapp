require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.20",
  networks: {
    ganache: {
      url: "http://127.0.0.1:7545",
      accounts: {
        mnemonic: "laptop soda duty liar stumble topple deny sudden perfect cinnamon chapter winter"
      }
    }
  }
};