# CardSwap DApp

CardSwap is a decentralized application (DApp) built on the Ethereum blockchain that allows users to buy, sell, and manage collectible trading cards using a custom ERC20 token.

## Project Structure

- **Smart Contracts**: Written in Solidity, using OpenZeppelin for creation of ERC20 token.
- **Frontend**: Built with React.js, interacts with smart contracts using Ethers.js.
- **Local Blockchain**: Uses Ganache to simulate a local blockchain
- **Token**: A custom ERC20 token named `CardToken` is used to facilitate transactions.

---

## Installation & Setup

### 1. Clone the repository
### 2. Install dependencies
From the root directory run: ```npm install ```
### 3. Start Ganache
Make sure Ganache is listening on port 7545
Copy the Mnemonic
### 4. Connect Ganache accounts to project
Enter the hardhat.config.js file and past the Mnemonic copied from Ganache to the field "mnemonic:"
### 5. Compile and deploy contracts
From the root directory run:
```npx hardhat compile ```
```npx hardhat run scripts/deploy.js --network localhost```
### 5. Start the react frontend
```cd frontend``` then 
```npm start```

The frontend allows the following functionality:
- Mint a Card. This minted card will take the connected wallet from MetaMask and use the wallet address to recognize the owner of the card.
- Buy a Card.
- View Cards
  
To buy a Card:
- Mint a Card.
- Use MetaMask to log in with a different account, make sure you have a different wallet address available.
- Refresh the page, the wallet address should be updated to the new address.
- Now under the card you want to buy, a "buy card" button should appear if you are not the owner of that card.
- You should be able to buy the card and become it's new owner if you have enough CARD tokens.

## Smart Contracts Overview
- **CardToken.sol** is a solidity file which implements an ERC20 token using openZeppelin and mints tokens to initial users.
- **CardMarketplace.sol** allows minting, buying and trading of cards. Stores card data in structs and mappings.

## Key Features
- Structs to manage card metadata (e.g., name, rarity, etc)
- Mappings to track card ownership and balances
- Modifiers to restrict actions (e.g, cannot buy if you already are the owner)
  
## DApp Features
- Connect to MetaMask
- Display token balance and owned cards
- Mint new cards (admin only)
- Buy cards using the custom token
- Display card metadata graphically
- All interactions use a local Ethereum network (Ganache)
