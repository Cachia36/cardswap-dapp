import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import CardTokenABI from "./abis/CardToken.json";
import CardMarketplaceABI from "./abis/CardMarketplace.json";

const CARDTOKEN_ADDRESS = "0x7d48dd8A2f20776099A66478f227e058F7294317";
const MARKETPLACE_ADDRESS = "0x7331c2798Dd03199De2164CFc1ecC14205e69ede";

function App() {
  const [wallet, setWallet] = useState(null);
  const [provider, setProvider] = useState(null);
  const [cardToken, setCardToken] = useState(null);
  const [marketplace, setMarketplace] = useState(null);
  const [cards, setCards] = useState([]);
  const [balance, setBalance] = useState("0");
  const [name, setName] = useState("");
  const [rarity, setRarity] = useState("");
  const [price, setPrice] = useState("");
  const [mintStatus, setMintStatus] = useState("");

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask to use this DApp");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setWallet(address);
      setProvider(provider);

      // Load contracts
      const token = new ethers.Contract(CARDTOKEN_ADDRESS, CardTokenABI.abi, signer);
      const market = new ethers.Contract(MARKETPLACE_ADDRESS, CardMarketplaceABI.abi, signer);

      const rawBal = await token.balanceOf(address);
      setBalance(ethers.formatEther(rawBal));
      setCardToken(token);
      setMarketplace(market);
    } catch (err) {
      console.error("Wallet connection error:", err);
    }
  };

  const mintCard = async () => {
    if (!marketplace) return;

    try {
      const priceInWei = ethers.parseEther(price);
      const tx = await marketplace.mintCard(name, rarity, priceInWei);
      await tx.wait();

      setMintStatus("Card minted successfully!");
      setName("");
      setRarity("");
      setPrice("");

      await loadCards();
    } catch (err) {
      console.error(err);
      setMintStatus("Failed to mint card.");
    }
  };

  const loadCards = async () => {
    if (!marketplace) return;

    try {
      const cardList = [];
      const count = await marketplace.nextCardId();

      for (let i = 0; i < Number(count); i++) {
        const card = await marketplace.getCard(i);

        // Skip deleted cards
        if (card[3] === "0x0000000000000000000000000000000000000000") continue;

        cardList.push({
          id: i,
          name: card[0],
          rarity: card[1],
          price: ethers.formatEther(card[2]),
          owner: card[3],
        });
      }

      setCards(cardList);
    } catch (err) {
      console.error("Failed to load cards:", err);
    }
  };

  const buyCard = async (cardId, priceInCard) => {
    if (!cardToken || !marketplace) return;

    try {
      const priceInWei = ethers.parseEther(priceInCard.toString());

      const balance = await cardToken.balanceOf(wallet);
      if (balance < priceInWei) {
        setMintStatus("Not enough CARD tokens to buy this card.");
        return;
      }

      // Approve the marketplace to spend CARD tokens
      const approveTx = await cardToken.approve(MARKETPLACE_ADDRESS, priceInWei);
      await approveTx.wait();

      // Buy the card
      const buyTx = await marketplace.buyCard(cardId);
      await buyTx.wait();

      setMintStatus("Card purchased!");
      await loadCards(); // Refresh list
      const rawBal = await cardToken.balanceOf(wallet);
      setBalance(ethers.formatEther(rawBal));
    } catch (err) {
      console.error("Buy failed:", err);
      setMintStatus(`Purchase failed: ${err.reason || err.message}`);
    }
  };

  useEffect(() => {
    (async () => {
      await connectWallet();
      await loadCards();

    })();
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>CardSwap DApp</h1>
      <p>
        {wallet ? `Connected Wallet: ${wallet}` : "Not connected to MetaMask"}
      </p>
      <p>CARD Balance: {balance}</p>
      <hr />

      <h2>Mint a New Card</h2>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br />
      <input
        type="text"
        placeholder="Rarity"
        value={rarity}
        onChange={(e) => setRarity(e.target.value)}
      />
      <br />
      <input
        type="text"
        placeholder="Price in CARD"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <br />
      <button onClick={mintCard} disabled={!marketplace}>
        Mint Card
      </button>

      <p>{mintStatus}</p>

      <hr />
      <button onClick={loadCards} disabled={!marketplace}>Refresh Cards</button>
      <h2>Available Cards</h2>
      {cards.length === 0 ? (
        <p>No cards minted yet.</p>
      ) : (
        cards.map((card) => (
          <div key={card.id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
            <p><strong>ID:</strong> {card.id}</p>
            <p><strong>Name:</strong> {card.name}</p>
            <p><strong>Rarity:</strong> {card.rarity}</p>
            <p><strong>Price:</strong> {card.price} CARD</p>
            <p><strong>Owner:</strong> {card.owner}</p>

            {card.owner.toLowerCase() !== wallet?.toLowerCase() && (
              <button onClick={() => buyCard(card.id, card.price)}>
                Buy This Card
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default App;