import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import "./index.css";

function App() {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showMnemonic, setShowMnemonic] = useState(false);
  const [activeNetwork, setActiveNetwork] = useState("ETH");

  const generateWallet = async () => {
    try {
      setLoading(true);
      setWallet(null);
      const res = await fetch("http://localhost:5000/generate-wallet");
      const data = await res.json();
      setWallet(data);
      setShowMnemonic(false);
      toast.success("OURO wallet created");
    } catch {
      toast.error("Failed to generate wallet");
    } finally {
      setLoading(false);
    }
  };

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="page">
      <Toaster position="top-right" />

      <div className="app-container">
        {/* BRAND */}
        <div className="brand">
          <div className="logo">◎</div>
          <div>
          <h1 className="app-title">OURO</h1>
          <p className="subtitle">Multi-Chain Wallet</p>
          </div>
        </div>

        <p className="security-note">
          🔒 OURO Multiwallet generator
        </p>

        <button onClick={generateWallet} disabled={loading}>
          {loading ? "Generating..." : "Generate Wallet"}
        </button>

        {loading && <div className="loader" />}

        {wallet && (
          <>
            {/* MNEMONIC */}
            <div className="section">
              <div className="section-header">
                <h3>Recovery Phrase</h3>
                <button
                  className="secondary"
                  onClick={() => setShowMnemonic(!showMnemonic)}
                >
                  {showMnemonic ? "Hide" : "Show"}
                </button>
              </div>

              <div className={`mnemonic-grid ${!showMnemonic ? "blur" : ""}`}>
                {wallet.mnemonic.split(" ").map((word, i) => (
                  <span key={i}>{word}</span>
                ))}
              </div>

              {showMnemonic && (
                <button
                  className="secondary"
                  onClick={() => copyText(wallet.mnemonic)}
                >
                  Copy Phrase
                </button>
              )}

              <div className="warning">
                ⚠ Never share your recovery phrase
              </div>
            </div>

            {/* NETWORK SWITCH */}
            <div className="network-switch">
              <button
                className={activeNetwork === "ETH" ? "active" : ""}
                onClick={() => setActiveNetwork("ETH")}
              >
                🟣 Ethereum
              </button>
              <button
                className={activeNetwork === "BTC" ? "active" : ""}
                onClick={() => setActiveNetwork("BTC")}
              >
                🟠 Bitcoin
              </button>
            </div>

            {/* ETH */}
            {activeNetwork === "ETH" && (
              <div className="card eth">
                <h3>Ethereum Wallet</h3>
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
            )}

            {/* BTC */}
            {activeNetwork === "BTC" && (
              <div className="card btc">
                <h3>Bitcoin Wallet</h3>
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
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
