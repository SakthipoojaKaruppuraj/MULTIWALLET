import { useState } from "react";
import "./index.css";

function App() {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showMnemonic, setShowMnemonic] = useState(false);

  const generateWallet = async () => {
    try {
      setLoading(true);
      setWallet(null);
      const res = await fetch("http://localhost:5000/generate-wallet");
      const data = await res.json();
      setWallet(data);
      setShowMnemonic(false);
    } catch (err) {
      console.error("Failed to generate wallet", err);
    } finally {
      setLoading(false);
    }
  };

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard");
  };

  return (
    <div className="page">
      <div className="app-container">
        <h2>🔐 Multi-Chain Wallet Generator</h2>
        <p className="subtitle">
          Generate Ethereum & Bitcoin wallets from a single mnemonic
        </p>

        <button onClick={generateWallet} disabled={loading}>
          {loading ? "Generating Wallet..." : "Generate Wallet"}
        </button>

        {wallet && (
          <>
            {/* Mnemonic */}
            <div className="section">
              <div className="section-header">
                <h3>Mnemonic Phrase</h3>
                <button
                  className="secondary"
                  onClick={() => setShowMnemonic(!showMnemonic)}
                >
                  {showMnemonic ? "Hide" : "Show"}
                </button>
              </div>

              <div className={`mnemonic ${!showMnemonic ? "blur" : ""}`}>
                {wallet.mnemonic}
              </div>

              {showMnemonic && (
                <button
                  className="secondary"
                  onClick={() => copyText(wallet.mnemonic)}
                >
                  Copy Mnemonic
                </button>
              )}

              <div className="warning">
                ⚠ Never share your mnemonic with anyone
              </div>
            </div>

            {/* Ethereum */}
            <div className="card">
              <h3>🟣 Ethereum Wallet</h3>
              <p className="label">Derivation Path</p>
              <code>{wallet.ethereum.path}</code>

              <p className="label">Address</p>
              <div className="address-row">
                <code>{wallet.ethereum.address}</code>
                <button
                  className="copy"
                  onClick={() => copyText(wallet.ethereum.address)}
                >
                  Copy
                </button>
              </div>
            </div>

            {/* Bitcoin */}
            <div className="card">
              <h3>🟠 Bitcoin Wallet</h3>
              <p className="label">Derivation Path</p>
              <code>{wallet.bitcoin.path}</code>

              <p className="label">Address</p>
              <div className="address-row">
                <code>{wallet.bitcoin.address}</code>
                <button
                  className="copy"
                  onClick={() => copyText(wallet.bitcoin.address)}
                >
                  Copy
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
