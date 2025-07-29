const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const ethers = require('ethers');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Load private key from environment variable
const PRIVATE_KEY = process.env.PRIVATE_KEY;
if (!PRIVATE_KEY) {
  throw new Error('PRIVATE_KEY environment variable is not set');
}

const wallet = new ethers.Wallet(PRIVATE_KEY);

app.post('/sign', async (req, res) => {
  try {
    const payload = req.body.payload;

    if (!payload) {
      return res.status(400).json({ error: 'Missing payload' });
    }

    const payloadString = JSON.stringify(payload);
    const message = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(payloadString));
    const signature = await wallet.signMessage(ethers.utils.arrayify(message));

    res.json({
      address: wallet.address,
      signature: signature
    });
  } catch (error) {
    console.error('Signing error:', error);
    res.status(500).json({ error: 'Signing failed' });
  }
});

app.get('/', (req, res) => {
  res.send('Lighter Signer is running');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
