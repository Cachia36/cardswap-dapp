// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./CardToken.sol";

contract CardMarketplace {
    struct Card {
        string name;
        string rarity;
        uint256 price;
        address owner;
    }

    mapping(uint256 => Card) public cards;
    uint256 public nextCardId;

    CardToken public token;

    constructor(address tokenAddress) {
        token = CardToken(tokenAddress);
    }

    function mintCard(string memory _name, string memory _rarity, uint256 _price) public {
        cards[nextCardId] = Card(_name, _rarity, _price, msg.sender);
        nextCardId++;
    }

    function buyCard(uint256 cardId) public {
        Card storage card = cards[cardId];
        require(token.transferFrom(msg.sender, card.owner, card.price), "Payment failed");
        card.owner = msg.sender;
    }

    function getCard(uint256 cardId) public view returns (string memory, string memory, uint256, address) {
        Card memory c = cards[cardId];
        return (c.name, c.rarity, c.price, c.owner);
    }
}