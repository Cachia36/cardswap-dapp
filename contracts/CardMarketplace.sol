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
        //Validate card exists
        require(cardId < nextCardId, "Card does not exist");
        Card storage card = cards[cardId];
        require(card.owner != msg.sender, "You already own this card");
        require(token.transferFrom(msg.sender, card.owner, card.price), "Payment failed");
        card.owner = msg.sender;
    }

    function deleteCard(uint256 cardId) public {
        require(cards[cardId].owner != address(0), "Card does not exist");
        require(cards[cardId].owner == msg.sender, "Not the owner of this card");
        delete cards[cardId];
    }

    function getCard(uint256 cardId) public view returns (string memory, string memory, uint256, address) {
        Card memory c = cards[cardId];
        return (c.name, c.rarity, c.price, c.owner);
    }
}