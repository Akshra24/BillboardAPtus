// Auto-detect API base URL based on environment
const API_BASE = window.API_BASE || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
  ? 'http://localhost:8080' 
  : '/api');

async function postJson(url, body){
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Request failed');
  }
  return data;
}

function setLoading(buttonId, resultId, isLoading) {
  const btn = document.getElementById(buttonId);
  const result = document.getElementById(resultId);
  
  if (isLoading) {
    btn.disabled = true;
    btn.style.opacity = '0.6';
    result.innerText = '⏳ Processing request...';
  } else {
    btn.disabled = false;
    btn.style.opacity = '1';
  }
}

function formatResult(result) {
  if (result.error) {
    return `❌ Error: ${result.error}`;
  }
  if (result.success && result.tx_hash) {
    return `✅ Success!\nTransaction Hash: ${result.tx_hash}\n\nView on Aptos Explorer:\nhttps://explorer.aptoslabs.com/txn/${result.tx_hash}?network=devnet`;
  }
  if (result.message) {
    return `📖 Message:\n${result.message}`;
  }
  return JSON.stringify(result, null, 2);
}

document.getElementById('initBtn').addEventListener('click', async () => {
  const key = document.getElementById('initKey').value.trim();
  const msg = document.getElementById('initMsg').value;
  const resultDiv = document.getElementById('initResult');
  
  if (!key || !msg) {
    resultDiv.innerText = '❌ Please provide both private key and message';
    return;
  }
  
  setLoading('initBtn', 'initResult', true);
  
  try {
    const r = await postJson(`${API_BASE}/initialize`, { privateKey: key, message: msg });
    resultDiv.innerText = formatResult(r);
  } catch (e) {
    resultDiv.innerText = `❌ Error: ${e.message}`;
  } finally {
    setLoading('initBtn', 'initResult', false);
  }
});

document.getElementById('setBtn').addEventListener('click', async () => {
  const key = document.getElementById('setKey').value.trim();
  const msg = document.getElementById('setMsg').value;
  const resultDiv = document.getElementById('setResult');
  
  if (!key || !msg) {
    resultDiv.innerText = '❌ Please provide both private key and message';
    return;
  }
  
  setLoading('setBtn', 'setResult', true);
  
  try {
    const r = await postJson(`${API_BASE}/set`, { privateKey: key, message: msg });
    resultDiv.innerText = formatResult(r);
  } catch (e) {
    resultDiv.innerText = `❌ Error: ${e.message}`;
  } finally {
    setLoading('setBtn', 'setResult', false);
  }
});

document.getElementById('readBtn').addEventListener('click', async () => {
  const addr = document.getElementById('readAddr').value.trim();
  const resultDiv = document.getElementById('readResult');
  
  if (!addr) {
    resultDiv.innerText = '❌ Please provide an address to read';
    return;
  }
  
  setLoading('readBtn', 'readResult', true);
  
  try {
    const r = await fetch(`${API_BASE}/message/${encodeURIComponent(addr)}`);
    const j = await r.json();
    
    if (!r.ok) {
      throw new Error(j.error || 'Failed to read message');
    }
    
    resultDiv.innerText = formatResult(j);
  } catch (e) {
    resultDiv.innerText = `❌ Error: ${e.message}`;
  } finally {
    setLoading('readBtn', 'readResult', false);
  }
});

// Auto-fill module address for reading
document.getElementById('readAddr').placeholder = 'Address to read (0x0b934d8296093a01ce424e530172908aefde114f1f9750a655573447fe5a9871)';
