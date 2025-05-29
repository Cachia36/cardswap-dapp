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
This will create 1,000,000 CARD tokens to the deployer (The first account given by ganache)
### 6. Start the react frontend
```cd frontend``` then 
```npm start```

Once MetaMask is set up and connected to the Ganache network, the frontend allows the following functionality:
- Mint a Card. This minted card will take the connected wallet from MetaMask and use the wallet address to recognize the owner of the card.
- Buy a Card.
- View Cards
  
To buy a Card:
- Mint a Card.
- Use MetaMask to log in with a different account, make sure you have a different wallet address available.
- Refresh the page, the wallet address should be updated to the new address.
- Now under the card you want to buy, a "buy card" button should appear if you are not the owner of that card.
- You should be able to buy the card and become it's new owner if you have enough CARD tokens.

## MetaMask Setup (Required)
To interact with the DApp, you must have the MetaMask browser extension installed and connected to your local Ganache network.

**1. Install MetaMask**
- Download from: https://metamask.io/
- Add it to your browser
  
**2. Connect to Ganache**
- Open Ganache and note the **RPC Server** (usually http://127.0.0.1:7545) and **Chain ID** (1337)
- In MetaMask:
  - Go to settings > Networks> Add a network manually
  - New RPC URL: http://127.0.0.1:7545
  - Chain ID: 1337
  - Save
    
**3. Import a Ganache Account**
- In Ganache, copy the private key of one of the first account (click the key icon and make sure the use the first account as it will have 1,000,000 CARD tokens) 
- Paste the private key
- This account will now be available in MetaMask and ready to use.

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

## Test Units
To run the test units run this from the root directory: ```npx hardhat test test/CardMarketplace.test.js```
Test include:
- Minting a card
- Buying a card
- Buying a card with not enough tokens
- Buying own card
- Buying nonexistent card
