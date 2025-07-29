const { Wallet } = require('ethers');
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

// Replace with your wallet address
const walletAddress = "0x36f65fc7546073B026BCB7f279bB20fAE8CD6A38";

app.post('/sign', async (req, res) => {
  try {
    const privateKey = process.env.PRIVATE_KEY;
    const wallet = new Wallet(privateKey);

    const payload = req.body.payload;

    const ethers = require('ethers');
const hash = ethers.utils.keccak256(
  ethers.utils.toUtf8Bytes(JSON.stringify(payload))
);
const signature = await wallet.signMessage(ethers.utils.arrayify(hash));


    res.json({
      address: walletAddress,
      signature,
    });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).send('Signing failed');
  }
});

app.listen(3000, () => {
  console.log('Signer live on port 3000');
});
