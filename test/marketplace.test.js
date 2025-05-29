const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CardMarketplace", function () {
    let Token, token, Marketplace, marketplace, owner, user;

    beforeEach(async () => {
        const signers = await ethers.getSigners();
        console.log("Signers Available:", signers.length);
        [owner, user, attacker] = await ethers.getSigners();

        Token = await ethers.getContractFactory("CardToken");
        token = await Token.deploy();
        await token.waitForDeployment();

        const tokenAddress = await token.getAddress();

        Marketplace = await ethers.getContractFactory("CardMarketplace");
        marketplace = await Marketplace.deploy(tokenAddress);
        await marketplace.waitForDeployment();

        // Give user some tokens
        await token.transfer(user.address, ethers.parseEther("1000"));
        //Give attacker some tokens
        await token.transfer(attacker.address, ethers.parseEther("1000"));
    });

    it("should mint a new card", async function () {
        await marketplace.mintCard("Dragon", "Legendary", ethers.parseEther("50"));

        const card = await marketplace.getCard(0);
        expect(card[0]).to.equal("Dragon");
        expect(card[1]).to.equal("Legendary");
        expect(card[2].toString()).to.equal(ethers.parseEther("50").toString());
        expect(card[3]).to.equal(owner.address);
    });

    it("should allow a user to buy a card", async function () {
        await marketplace.mintCard("Phoenix", "Epic", ethers.parseEther("25"));

        // user approves the contract to spend tokens
        await token.connect(user).approve(await marketplace.getAddress(), ethers.parseEther("25"));

        // user buys the card
        await marketplace.connect(user).buyCard(0);

        const card = await marketplace.getCard(0);
        expect(card[3]).to.equal(user.address); // new owner
    });

    /*
    To implement
    Nonexistend card - reverts if the card Id doesn't exist
    */

    it("Should fail if a user does not have enough tokens", async function () {
        await marketplace.mintCard("Leviathan", "Rare", ethers.parseEther("500"));
        await token.connect(attacker).approve(await marketplace.getAddress(), ethers.parseEther("100"));
        await expect(marketplace.connect(attacker).buyCard(0)).to.be.reverted;
    });

    it("Should fail if a user tries to buy a card which they already own", async function () {
        await marketplace.mintCard("Troll", "Epic", ethers.parseEther("50"));
        await token.connect(owner).approve(await marketplace.getAddress(), ethers.parseEther("50"));

        await expect(
            marketplace.connect(owner).buyCard(0)
        ).to.be.revertedWith("You already own this card");
    });

    it("Should fail if a user tries to buy a card that does not exist", async function () {
        await token.connect(owner).approve(await marketplace.getAddress(), ethers.parseEther("50"));
        await expect(
            marketplace.connect(owner).buyCard(0)
        ).to.be.revertedWith("Card does not exist");
    })
});