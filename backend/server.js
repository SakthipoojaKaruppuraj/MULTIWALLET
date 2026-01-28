import express from "express";
import cors from "cors";
import * as bip39 from "bip39";
import { BIP32Factory } from "bip32";
import * as ecc from "tiny-secp256k1";
import { Wallet } from "ethers";
import * as bitcoin from "bitcoinjs-lib";

const app = express();
app.use(cors());
app.use(express.json());

const bip32 = BIP32Factory(ecc);

app.get("/generate-wallet", async (req, res) => {
  try {
    const mnemonic = bip39.generateMnemonic();
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const root = bip32.fromSeed(seed);

    // Ethereum
    const ethPath = "m/44'/60'/0'/0/0";
    const ethNode = root.derivePath(ethPath);
    const ethPrivateKey =
      "0x" + Buffer.from(ethNode.privateKey).toString("hex");
    const ethWallet = new Wallet(ethPrivateKey);

    // Bitcoin
    const btcPath = "m/44'/0'/0'/0/0";
    const btcNode = root.derivePath(btcPath);
    const btcAddress = bitcoin.payments.p2pkh({
      pubkey: btcNode.publicKey,
      network: bitcoin.networks.bitcoin,
    });

    res.json({
      mnemonic,
      ethereum: {
        path: ethPath,
        address: ethWallet.address,
      },
      bitcoin: {
        path: btcPath,
        address: btcAddress.address,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () =>
  console.log("🚀 Backend running on http://localhost:5000")
);
