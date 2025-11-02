Billboard backend
=================

Minimal Express server that wraps Aptos JS SDK to interact with the Billboard Move module.

Quick start
-----------

1. Install dependencies

```powershell
cd billboard\backend
npm install
```

2. Create `.env` from `.env.example` and optionally set `MODULE_ADDRESS` if different.

3. Start the server

```powershell
npm start
```

Endpoints
---------
- POST /initialize
  - Body: { privateKey: string (hex without 0x or with 0x), message: string }
  - Calls Billboard::initialize
- POST /set
  - Body: { privateKey: string, message: string }
  - Calls Billboard::set_message_script
- GET /message/:address
  - Returns JSON { address, message }

Integration test
----------------
There's a small optional integration test which will call the running backend's `/set` and `/message` endpoints.

Usage (requires the server to be running and a funded private key):

```powershell
cd .\backend
# Set TEST_PRIVATE_KEY and run test
$env:TEST_PRIVATE_KEY = '0x..your_private_key..'
npm run test:backend
```

If `TEST_PRIVATE_KEY` is not set the test will skip (exit 0). The test performs a `POST /set` and then `GET /message/<MODULE_ADDRESS>` to verify the message was updated.

Security note
-------------
This is a demo scaffold. Do not send raw private keys to servers in production. Use secure signing solutions or let users sign on the client side.
