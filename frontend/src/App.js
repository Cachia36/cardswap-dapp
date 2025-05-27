import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import CardTokenABI from "./abis/CardToken.json";
import CardMarketplaceABI from "./abis/CardMarketplace.json";

const CARDTOKEN_ADDRESS = "0x7d48dd8A2f20776099A66478f227e058F7294317"; // your deployed token
const MARKETPLACE_ADDRESS = "0x04A24343C31bE5Cb65815656F74f246Fc52AEB7c"; // your deployed marketplace

function App() {
  const [wallet, setWallet] = useState(null);
  const [provider, setProvider] = useState(null);
  const [cardToken, setCardToken] = useState(null);
  const [marketplace, setMarketplace] = useState(null);

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
      setMintStatus("Card minted successfully");
      setName("");
      setRarity("");
      setPrice("");
    } catch (err) {
      console.error(err);
      setMintStatus("Failed to mint card.");
    }
  }

  useEffect(() => {
    connectWallet(); // auto-connect on load
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>CardSwap DApp</h1>
      <p>
        {wallet ? `Connected Wallet: ${wallet}` : "Not connected to MetaMask"}
      </p>

      <hr />

      <h2>🧾 Mint a New Card</h2>
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
    </div>
  );
}

export default App;