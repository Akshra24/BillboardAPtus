/*
 Simple backend integration test.
 It requires TEST_PRIVATE_KEY env var to be set to a hex private key (with or without 0x).

 What it does:
  - POST /set with a unique message
  - GET /message/<module_addr> and verify message changed
*/
const fetch = require('node-fetch');
const fs = require('fs');

const BASE = process.env.BASE_URL || 'http://127.0.0.1:8080';
const MODULE_ADDR = process.env.MODULE_ADDRESS || '0x0b934d8296093a01ce424e530172908aefde114f1f9750a655573447fe5a9871';
const priv = process.env.TEST_PRIVATE_KEY;

if (!priv) {
  console.log('TEST_PRIVATE_KEY not set, skipping integration test.');
  process.exit(0);
}

(async function(){
  try {
    const msg = 'test-msg-' + Date.now();
    console.log('setting message to', msg);
    const setRes = await fetch(`${BASE}/set`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ privateKey: priv, message: msg }) });
    const setJson = await setRes.json();
    if (!setRes.ok) throw new Error('set failed: ' + JSON.stringify(setJson));
    console.log('set tx:', setJson.tx_hash || setJson);

    // wait a couple seconds for transaction to commit
    await new Promise(r=>setTimeout(r, 3000));

    const readRes = await fetch(`${BASE}/message/${MODULE_ADDR}`);
    const readJson = await readRes.json();
    console.log('read:', readJson);
    if (readJson.message !== msg) throw new Error(`message mismatch: expected ${msg}, got ${readJson.message}`);

    console.log('backend integration test passed');
    process.exit(0);
  } catch (e) {
    console.error('backend integration test failed:', e && e.message ? e.message : e);
    process.exit(2);
  }
})();
