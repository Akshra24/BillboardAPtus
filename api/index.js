// Vercel serverless function entry point
// This wraps the Express app for Vercel's serverless environment

const path = require('path');

// Import the Express app configuration
// We'll create a simplified version for serverless
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { AptosClient, AptosAccount } = require('aptos');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Environment variables
const APTOS_NODE_URL = process.env.APTOS_NODE_URL || 'https://fullnode.devnet.aptoslabs.com';
const MODULE_ADDRESS = process.env.MODULE_ADDRESS || '0x0b934d8296093a01ce424e530172908aefde114f1f9750a655573447fe5a9871';

const client = new AptosClient(APTOS_NODE_URL);

// Helper functions
function normalizePrivateKey(pk) {
  if (!pk) return null;
  let s = String(pk).trim();
  if (s.startsWith('0x') || s.startsWith('0X')) s = s.slice(2);
  if (!/^[0-9a-fA-F]+$/.test(s)) return null;
  if (s.length < 64 || s.length > 128) return null;
  return s;
}

// Health check endpoint
app.get('/health', (req, res) => {
  const payload = {
    status: 'ok',
    node: APTOS_NODE_URL,
    module: MODULE_ADDRESS,
    platform: 'Vercel'
  };
  res.json(payload);
});

// POST /api/initialize
app.post('/api/initialize', async (req, res) => {
  try {
    const { privateKey, message } = req.body;
    if (!privateKey || !message) {
      return res.status(400).json({ error: 'privateKey and message required' });
    }
    if (typeof message !== 'string' || message.length === 0 || message.length > 4096) {
      return res.status(400).json({ error: 'message must be a non-empty string <=4096 chars' });
    }
    
    const norm = normalizePrivateKey(privateKey);
    if (!norm) return res.status(400).json({ error: 'invalid privateKey format' });
    
    const account = new AptosAccount(Buffer.from(norm, 'hex'));

    const payload = {
      type: 'entry_function_payload',
      function: `${MODULE_ADDRESS}::Billboard::initialize`,
      type_arguments: [],
      arguments: [Array.from(Buffer.from(message, 'utf8'))]
    };

    const txnRequest = await client.generateTransaction(account.address(), payload);
    const signedTxn = await client.signTransaction(account, txnRequest);
    const transactionRes = await client.submitTransaction(signedTxn);
    await client.waitForTransaction(transactionRes.hash);

    return res.json({ success: true, tx_hash: transactionRes.hash });
  } catch (e) {
    console.error('Initialize error:', e);
    return res.status(500).json({ error: e.message || String(e) });
  }
});

// POST /api/set
app.post('/api/set', async (req, res) => {
  try {
    const { privateKey, message } = req.body;
    if (!privateKey || !message) {
      return res.status(400).json({ error: 'privateKey and message required' });
    }
    if (typeof message !== 'string' || message.length === 0 || message.length > 4096) {
      return res.status(400).json({ error: 'message must be a non-empty string <=4096 chars' });
    }
    
    const norm = normalizePrivateKey(privateKey);
    if (!norm) return res.status(400).json({ error: 'invalid privateKey format' });
    
    const account = new AptosAccount(Buffer.from(norm, 'hex'));

    const payload = {
      type: 'entry_function_payload',
      function: `${MODULE_ADDRESS}::Billboard::set_message_script`,
      type_arguments: [],
      arguments: [Array.from(Buffer.from(message, 'utf8'))]
    };

    const txnRequest = await client.generateTransaction(account.address(), payload);
    const signedTxn = await client.signTransaction(account, txnRequest);
    const transactionRes = await client.submitTransaction(signedTxn);
    await client.waitForTransaction(transactionRes.hash);

    return res.json({ success: true, tx_hash: transactionRes.hash });
  } catch (e) {
    console.error('Set error:', e);
    return res.status(500).json({ error: e.message || String(e) });
  }
});

// GET /api/message/:address
app.get('/api/message/:address', async (req, res) => {
  try {
    const target = req.params.address;
    const type = `${MODULE_ADDRESS}::Billboard::Billboard`;
    const timeoutMs = 10000;
    
    const resource = await Promise.race([
      client.getAccountResource(target, type),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('timeout contacting Aptos node')), timeoutMs)
      )
    ]);
    
    const messageField = resource.data.message;
    let message = '';
    if (typeof messageField === 'string' && messageField.startsWith('0x')) {
      message = Buffer.from(messageField.slice(2), 'hex').toString('utf8');
    } else if (Array.isArray(messageField)) {
      message = Buffer.from(messageField).toString('utf8');
    } else {
      message = String(messageField);
    }
    
    return res.json({ address: target, message });
  } catch (e) {
    console.error('Read message error:', e);
    return res.status(500).json({ error: e.message || String(e) });
  }
});

// Serve static files in development, but Vercel handles this in production
if (process.env.VERCEL_ENV !== 'production') {
  const FRONTEND_DIR = path.join(__dirname, '..', 'frontend');
  app.use(express.static(FRONTEND_DIR));
  app.get('/', (req, res) => {
    res.sendFile(path.join(FRONTEND_DIR, 'index.html'));
  });
}

// Export for Vercel
module.exports = app;

