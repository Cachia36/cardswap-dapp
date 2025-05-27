require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.20",
  networks: {
    ganache: {
      url: "http://127.0.0.1:7545",
      accounts: [
        "0xd9a507a5c3cbd3cdca22111181480244359fb9818083f4aca6f04b4d0c8ded22"
      ]
    }
  }
};
