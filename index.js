import express from "express";
import dotenv from "dotenv";
import { Wallet, hashMessage } from "ethers";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const PRIVATE_KEY = process.env.PRIVATE_KEY;

if (!PRIVATE_KEY) {
  console.error("❌ PRIVATE_KEY not found in .env");
  process.exit(1);
}

const wallet = new Wallet(PRIVATE_KEY);

// Main signing endpoint
app.post("/sign", async (req, res) => {
  try {
    const { payload } = req.body;

    if (!payload) {
      return res.status(400).json({ error: "Missing payload" });
    }

    const json = JSON.stringify(payload);
    const hash = hashMessage(json);
    const signature = await wallet.signMessage(json);

    return res.json({ hash, signature });
  } catch (err) {
    console.error("Signing failed:", err.message);
    return res.status(500).json({ error: "Signing failed" });
  }
});

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
