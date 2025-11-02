# Billboard Deployment Guide

## 🎉 Quick Start

The Billboard project is now fully deployed and running! Here's everything you need to know.

## 📋 Current Status

✅ **Backend**: Running on `http://127.0.0.1:8080`  
✅ **Frontend**: Served at `http://127.0.0.1:8080/index.html`  
✅ **Blockchain**: Connected to Aptos Devnet  
✅ **Module**: Deployed at `0x0b934d8296093a01ce424e530172908aefde114f1f9750a655573447fe5a9871`

## 🚀 Access the Application

### Option 1: Browser (Recommended)
Simply open your browser and navigate to:
```
http://127.0.0.1:8080/index.html
```

Or just:
```
http://localhost:8080
```

### Option 2: Command Line API
Test the API endpoints using PowerShell:

```powershell
# Check health
Invoke-WebRequest http://127.0.0.1:8080/health -UseBasicParsing | Select-Object -ExpandProperty Content

# Read a message
$addr = "0x0b934d8296093a01ce424e530172908aefde114f1f9750a655573447fe5a9871"
Invoke-RestMethod "http://127.0.0.1:8080/message/$addr"
```

## 🛠️ Manual Server Management

### Starting the Server

```powershell
cd C:\Users\akshra\aptos\billboard\backend
node index.js
```

Or run in the background:
```powershell
Start-Job -ScriptBlock { cd C:\Users\akshra\aptos\billboard\backend; node index.js }
```

### Stopping the Server

Find the process and stop it:
```powershell
# Find the process
netstat -ano | Select-String ":8080"

# Stop it (replace PID with the actual process ID)
Stop-Process -Id <PID> -Force
```

Or kill all node processes:
```powershell
Get-Process -Name node | Stop-Process -Force
```

### Checking Server Status

```powershell
# Check if port 8080 is listening
netstat -ano | Select-String ":8080"

# Test the health endpoint
Invoke-WebRequest http://127.0.0.1:8080/health -UseBasicParsing
```

## 📁 Project Structure

```
billboard/
├── backend/              # Express API server
│   ├── index.js         # Main server file
│   ├── package.json     # Dependencies
│   ├── test_backend.js  # Integration tests
│   └── verify.js        # Verification script
├── frontend/            # Web UI
│   ├── index.html       # Main UI
│   ├── app.js           # Frontend logic
│   └── README.md        # Frontend docs
├── sources/             # Move smart contract
│   └── Billboard.move
├── scripts/             # Transaction scripts
├── build/               # Compiled Move bytecode
└── README.md            # Main documentation
```

## 🔌 API Endpoints

### GET /health
Returns server status and configuration.

**Response:**
```json
{
  "status": "ok",
  "node": "https://fullnode.devnet.aptoslabs.com",
  "module": "0x0b934d8296093a01ce424e530172908aefde114f1f9750a655573447fe5a9871"
}
```

### GET /message/:address
Reads the message stored on a Billboard address.

**Example:**
```bash
GET http://127.0.0.1:8080/message/0x0b934d8296093a01ce424e530172908aefde114f1f9750a655573447fe5a9871
```

**Response:**
```json
{
  "address": "0x0b934d8296093a01ce424e530172908aefde114f1f9750a655573447fe5a9871",
  "message": "Welcome_to_Aptos_Move!"
}
```

### POST /initialize
Creates a new Billboard resource under your account.

**Request:**
```json
{
  "privateKey": "your_private_key_here",
  "message": "Hello, Aptos!"
}
```

**Response:**
```json
{
  "success": true,
  "tx_hash": "0x..."
}
```

### POST /set
Updates an existing Billboard message.

**Request:**
```json
{
  "privateKey": "your_private_key_here",
  "message": "Updated message"
}
```

**Response:**
```json
{
  "success": true,
  "tx_hash": "0x..."
}
```

## 🔒 Security Notes

⚠️ **Important**: This is a demonstration project. The backend accepts raw private keys in requests for convenience only.

**For Production:**
- Never send private keys to servers
- Use client-side wallet signing (e.g., Petra wallet)
- Implement proper authentication and authorization
- Use environment variables for sensitive configuration
- Enable HTTPS/TLS
- Rate limit API endpoints

## 🧪 Testing

### Backend Integration Test

```powershell
cd billboard\backend
$env:TEST_PRIVATE_KEY = '0x...your_private_key...'
npm run test:backend
```

### Verification Script

```powershell
cd billboard\backend
node verify.js
```

## 🌐 Network Configuration

Currently configured for **Aptos Devnet**.

To change networks, modify `billboard/backend/index.js` or set environment variables:

```powershell
$env:APTOS_NODE_URL = "https://fullnode.testnet.aptoslabs.com"
$env:MODULE_ADDRESS = "0x..."
```

## 📊 Monitoring

### Logs

Server logs are written to `billboard/backend/server.log`:
```powershell
Get-Content billboard\backend\server.log -Tail 20
```

### Real-time Monitoring

The server outputs heartbeat messages every 30 seconds to confirm it's running.

## 🐛 Troubleshooting

### Server Won't Start

1. Check if port 8080 is already in use:
   ```powershell
   netstat -ano | Select-String ":8080"
   ```

2. Verify dependencies are installed:
   ```powershell
   cd billboard\backend
   npm list
   ```

3. Check for errors in the console or server.log

### Can't Access Frontend

1. Verify backend is running
2. Try `http://127.0.0.1:8080` instead of `localhost:8080`
3. Check browser console for errors
4. Verify firewall isn't blocking port 8080

### Blockchain Connection Issues

1. Check internet connectivity
2. Verify Aptos Devnet is accessible
3. Check if MODULE_ADDRESS is correct
4. Review network errors in server logs

## 📚 Additional Resources

- [Aptos Documentation](https://aptos.dev)
- [Move Language Reference](https://aptos.dev/move)
- [Aptos Explorer](https://explorer.aptoslabs.com)
- [Move CLI Tools](https://aptos.dev/tools/aptos-cli)

## 🎯 Next Steps

1. **Customize the UI**: Modify `billboard/frontend/index.html` and `app.js`
2. **Add Features**: Extend the Billboard Move module
3. **Deploy to Production**: Use proper hosting (Heroku, AWS, etc.)
4. **Connect Wallet**: Integrate Petra or other Aptos wallets
5. **Add Authentication**: Implement user authentication
6. **Monitor Transactions**: Set up transaction monitoring

## 🎉 Enjoy!

Your Billboard application is now live and ready to use. Experiment with storing messages on the Aptos blockchain!

