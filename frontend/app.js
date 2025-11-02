const API_BASE = window.API_BASE || 'http://localhost:8080';

async function postJson(url, body){
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  return res.json();
}

document.getElementById('initBtn').addEventListener('click', async () => {
  const key = document.getElementById('initKey').value.trim();
  const msg = document.getElementById('initMsg').value;
  document.getElementById('initResult').innerText = 'Sending...';
  try {
    const r = await postJson(`${API_BASE}/initialize`, { privateKey: key, message: msg });
    document.getElementById('initResult').innerText = JSON.stringify(r, null, 2);
  } catch (e) {
    document.getElementById('initResult').innerText = e.message;
  }
});

document.getElementById('setBtn').addEventListener('click', async () => {
  const key = document.getElementById('setKey').value.trim();
  const msg = document.getElementById('setMsg').value;
  document.getElementById('setResult').innerText = 'Sending...';
  try {
    const r = await postJson(`${API_BASE}/set`, { privateKey: key, message: msg });
    document.getElementById('setResult').innerText = JSON.stringify(r, null, 2);
  } catch (e) {
    document.getElementById('setResult').innerText = e.message;
  }
});

document.getElementById('readBtn').addEventListener('click', async () => {
  const addr = document.getElementById('readAddr').value.trim();
  document.getElementById('readResult').innerText = 'Fetching...';
  try {
    const r = await fetch(`${API_BASE}/message/${encodeURIComponent(addr)}`);
    const j = await r.json();
    document.getElementById('readResult').innerText = JSON.stringify(j, null, 2);
  } catch (e) {
    document.getElementById('readResult').innerText = e.message;
  }
});
