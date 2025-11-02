# Billboard (Aptos Move)

This is a minimal Aptos Move package that implements a simple on-chain "billboard": a single message stored as a resource under an owner's account.

Files:
- `Move.toml` - package manifest (replace `address` with your publishing address)
- `sources/Billboard.move` - Move module
- `scripts/` - example transaction scripts to set/read the message

Quick (PowerShell) commands using the Aptos CLI:

1) Compile the package (replace package address if you changed it)

```powershell
# from the project root (billboard)
aptos move compile --package-dir .
```

2) Run an example script on a local validator or devnet (ensure aptos CLI is configured)

```powershell
# Submit the set_message script using the default profile (ensure your CLI profile has the private key for the address in Move.toml)
aptos move run --package-dir . --script-file scripts/set_message.move --assume-yes
```

Notes:
- The package is configured to publish under the account address `0x1cc990b55d336b812a089464d063e9ebfe1691391b9cadfb3acb15257ffb12ee`.
- The module uses `vector<u8>` for messages; client code can encode/decode UTF-8 as needed.
- For tests and CI, consider adding Move unit tests under `tests/` or using the Aptos test harness.

Backend & Frontend (quick start)
--------------------------------

1) Start the backend API server

```powershell
cd .\backend
npm install
# create a .env file from .env.example and set MODULE_ADDRESS if different
npm start
```

By default the backend binds to port 8080 and expects the Billboard module address in `MODULE_ADDRESS`.

2) Open the frontend

Open `frontend\index.html` in your browser (or serve the `frontend` directory with any static server). The UI will call the backend at `http://localhost:8080` by default.

3) Test reading the on-chain message (example)

```powershell
# using PowerShell's Invoke-RestMethod to fetch current message
Invoke-RestMethod "http://localhost:8080/message/0x0b934d8296093a01ce424e530172908aefde114f1f9750a655573447fe5a9871"
```

Security note: The backend accepts raw private keys in requests for demo convenience only. Do NOT use this pattern in production — instead use client-side wallets or a secure signing service.

Verification (what I ran)
-------------------------

I scaffolded and started the backend during this session. I attempted to verify the GET /message endpoint for the deployed module address. If you run into connectivity issues, these are the commands I used and recommended troubleshooting steps:

1) Start the backend (from project root):

```powershell
cd .\backend
npm install
npm start
```

2) Confirm the server is listening (PowerShell):

```powershell
netstat -ano | Select-String ":8080"
Test-NetConnection -ComputerName 127.0.0.1 -Port 8080
```

3) Fetch the current on-chain message via the backend:

```powershell
Invoke-RestMethod "http://localhost:8080/message/<MODULE_ADDRESS>"
```

If the request fails to connect, ensure the backend process is running and not blocked by a local firewall, or try `http://127.0.0.1:8080` instead of `localhost`.

If you'd like, I can continue troubleshooting the local server start and complete an automated verification run (I attempted this already but the server was unreachable from the test runner intermittently). Tell me if you want me to keep trying to start the server and verify, or if you prefer to run the quick checks locally and I help interpret the results.
