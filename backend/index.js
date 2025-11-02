/* Minimal Express backend to interact with the Billboard Move module on Aptos devnet.

Environment variables (see .env.example):
- APTOS_NODE_URL - devnet fullnode URL (default: https://fullnode.devnet.aptoslabs.com)
- MODULE_ADDRESS - address of deployed Billboard module (e.g. 0x0b93...)

This server exposes:
- POST /initialize { privateKey, message } -> publishes a transaction calling Billboard::initialize
- POST /set { privateKey, message } -> calls Billboard::set_message_script
- GET  /message/:address -> reads the Billboard resource from chain and returns message string

Security: this is a demo. Do NOT store or send private keys to production servers unencrypted.
*/

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const LOG_PATH = path.join(__dirname, 'server.log');

function logToFile(msg) {
  try { fs.appendFileSync(LOG_PATH, `${new Date().toISOString()} ${msg}\n`); } catch(e) {}
}
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { AptosClient, AptosAccount, TxnBuilderTypes, BCS, FaucetClient } = require('aptos');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const APTOS_NODE_URL = process.env.APTOS_NODE_URL || 'https://fullnode.devnet.aptoslabs.com';
const MODULE_ADDRESS = process.env.MODULE_ADDRESS || '0x0b934d8296093a01ce424e530172908aefde114f1f9750a655573447fe5a9871';

const client = new AptosClient(APTOS_NODE_URL);

// Log environment and dependency info for debugging
try {
  const pkg = require('./package.json');
  const info = `env: NODE_ENV=${process.env.NODE_ENV || 'none'}; pkg.name=${pkg.name}; pkg.version=${pkg.version}`;
  console.log(info);
  logToFile(info);
} catch (e) {
  console.log('no package.json metadata');
}

// Basic health endpoint to verify the server is up without calling Aptos network
app.get('/health', (req, res) => {
  const payload = { status: 'ok', node: APTOS_NODE_URL, module: MODULE_ADDRESS };
  res.json(payload);
});

function strToBytesArray(s){
  return Array.from(Buffer.from(s, 'utf8'));
}

function normalizePrivateKey(pk){
  if (!pk) return null;
  let s = String(pk).trim();
  if (s.startsWith('0x') || s.startsWith('0X')) s = s.slice(2);
  // basic sanity: hex only
  if (!/^[0-9a-fA-F]+$/.test(s)) return null;
  // typical ed25519 private key length in hex is 64 or 128; allow 64..128
  if (s.length < 64 || s.length > 128) return null;
  return s;
}

// Helper to build an EntryFunction payload for our module
function entryFunctionPayload(functionName, args){
  return new TxnBuilderTypes.TransactionPayloadEntryFunction(
    TxnBuilderTypes.EntryFunction.natural(
      `${MODULE_ADDRESS}::Billboard`,
      functionName,
      [],
      args.map(a => {
        // if arg is a string -> vector<u8>
        if (typeof a === 'string') {
          const bytes = Buffer.from(a, 'utf8');
          return BCS.bcsSerializeBytes(bytes);
        }
        return a;
      })
    )
  );
}

// POST /initialize
app.post('/initialize', async (req, res) => {
  try {
    const { privateKey, message } = req.body;
    if (!privateKey || !message) return res.status(400).json({ error: 'privateKey and message required' });
    if (typeof message !== 'string' || message.length === 0 || message.length > 4096) return res.status(400).json({ error: 'message must be a non-empty string <=4096 chars' });
    const norm = normalizePrivateKey(privateKey);
    if (!norm) return res.status(400).json({ error: 'invalid privateKey format' });
    const account = AptosAccount.fromHex(norm);

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
    console.error(e);
    return res.status(500).json({ error: e.message || String(e) });
  }
});

// POST /set
app.post('/set', async (req, res) => {
  try {
    const { privateKey, message } = req.body;
    if (!privateKey || !message) return res.status(400).json({ error: 'privateKey and message required' });
    if (typeof message !== 'string' || message.length === 0 || message.length > 4096) return res.status(400).json({ error: 'message must be a non-empty string <=4096 chars' });
    const norm = normalizePrivateKey(privateKey);
    if (!norm) return res.status(400).json({ error: 'invalid privateKey format' });
    const account = AptosAccount.fromHex(norm);

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
    console.error(e);
    return res.status(500).json({ error: e.message || String(e) });
  }
});

// GET /message/:address
app.get('/message/:address', async (req, res) => {
  try {
    const target = req.params.address;
    // resource type is <MODULE_ADDRESS>::Billboard::Billboard
    const type = `${MODULE_ADDRESS}::Billboard::Billboard`;
    // add a timeout to the network call so requests don't hang indefinitely
    const timeoutMs = 10000;
    const resource = await Promise.race([
      client.getAccountResource(target, type),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout contacting Aptos node')), timeoutMs))
    ]);
    // resource.data.message may be returned as a hex string ("0x...") or as an array of bytes
    const messageField = resource.data.message;
    let message = '';
    if (typeof messageField === 'string' && messageField.startsWith('0x')) {
      // hex string
      message = Buffer.from(messageField.slice(2), 'hex').toString('utf8');
    } else if (Array.isArray(messageField)) {
      message = Buffer.from(messageField).toString('utf8');
    } else {
      // fallback to string conversion
      message = String(messageField);
    }
    return res.json({ address: target, message });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message || String(e) });
  }
});

const PORT = process.env.PORT || 8080;
// Bind explicitly to localhost to avoid potential interface/IPv6 binding issues in some environments
app.listen(PORT, '127.0.0.1', () => {
  const msg = `Billboard backend listening on ${PORT} (node: ${APTOS_NODE_URL})`;
  console.log(msg);
  logToFile(msg);
})
  .on('error', (err) => {
    console.error('HTTP server failed to start:', err);
    logToFile('HTTP server failed to start: ' + String(err));
    process.exit(1);
  });

// Global handlers to surface errors in the logs instead of silently exiting
process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at:', p, 'reason:', reason);
  logToFile('UnhandledRejection: ' + String(reason));
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception thrown:', err);
  logToFile('UncaughtException: ' + String(err));
});

// Keepalive heartbeat to make sure the process stays alive and to help debugging
setInterval(() => {
  const hb = `heartbeat ${new Date().toISOString()}`;
  console.log(hb);
  logToFile(hb);
}, 30_000);
