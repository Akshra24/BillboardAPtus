const http = require('http');
const fs = require('fs');
const path = require('path');

const BASE = 'http://127.0.0.1:8080';
const MODULE_ADDR = process.env.MODULE_ADDRESS || '0x0b934d8296093a01ce424e530172908aefde114f1f9750a655573447fe5a9871';

function get(pathname, timeout = 10000) {
  return new Promise((resolve, reject) => {
    const req = http.get(`${BASE}${pathname}`, (res) => {
      let data = '';
      res.setEncoding('utf8');
      res.on('data', (c) => data += c);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch(e) { resolve({ raw: data }); }
      });
    });
    req.on('error', reject);
    req.setTimeout(timeout, () => { req.destroy(new Error('timeout')); });
  });
}

(async function main(){
  try {
    const health = await get('/health');
    console.log('health:', health);
    const message = await get(`/message/${MODULE_ADDR}`);
    console.log('message:', message);
    const out = { health, message };
    fs.writeFileSync(path.join(__dirname, 'out.json'), JSON.stringify(out, null, 2), 'utf8');
    console.log('wrote out.json');
  } catch (e) {
    console.error('verification failed:', e && e.message ? e.message : e);
    process.exitCode = 2;
  }
})();
