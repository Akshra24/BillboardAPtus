# Aptos Billboard

A decentralized on-chain messaging platform built on the Aptos blockchain. This project demonstrates how to create, update, and read messages stored on-chain using Move smart contracts, with a beautiful web interface and RESTful API.

## Features

- **Easy Setup**: One-click startup script
- **Beautiful UI**: Modern, responsive web interface
- **On-Chain Storage**: Messages stored permanently on Aptos blockchain
- **Owner Control**: Only the owner can update their Billboard
- **REST API**: Full backend API for integration
- **Fully Tested**: Integration tests included

## Quick Start

### Option 1: Automated (Recommended)

**Start the application:**
```powershell
cd C:\Users\akshra\aptos\billboard
.\start.ps1
```

The script will:
- Check Node.js installation
- Install dependencies if needed
- Start the backend server
- Open the frontend in your browser

**Stop the application:**
```powershell
.\stop.ps1
```

### Option 2: Manual

**1. Start the backend:**
```powershell
cd .\backend
npm install
npm start
```

**2. Access the frontend:**
Open your browser and navigate to `http://127.0.0.1:8080`

## Documentation

- **Full Deployment Guide**: See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions
- **Backend API Docs**: See [backend/README.md](backend/README.md)
- **Frontend Docs**: See [frontend/README.md](frontend/README.md)

## Project Structure

```
billboard/
├── backend/                 # Express API server
│   ├── index.js            # Main server (serves API + frontend)
│   ├── test_backend.js     # Integration tests
│   └── verify.js           # Verification script
├── frontend/               # Web UI
│   ├── index.html          # Beautiful modern UI
│   └── app.js              # Frontend logic
├── sources/                # Move smart contract
│   └── Billboard.move      # On-chain Billboard module
├── scripts/                # Transaction scripts
├── build/                  # Compiled Move bytecode
├── start.ps1               # Quick start script
├── stop.ps1                # Stop script
├── DEPLOYMENT.md           # Detailed deployment guide
└── README.md               # This file
```

## API Endpoints

### GET /health
Server health check

### GET /message/:address
Read a Billboard message from any address

### POST /initialize
Create a new Billboard with an initial message

### POST /set
Update an existing Billboard message

See [DEPLOYMENT.md](DEPLOYMENT.md) for full API documentation.

## Current Deployment

- **Network**: Aptos Devnet
- **Module Address**: `0x0b934d8296093a01ce424e530172908aefde114f1f9750a655573447fe5a9871`
- **Server**: `http://127.0.0.1:8080`
- **Status**: Running

## Development

### Compile Move Contract
```powershell
aptos move compile --package-dir .
```

### Run Tests
```powershell
cd backend
npm run test:backend
```

### Verify Deployment
```powershell
cd backend
node verify.js
```

## Security Notes

**Important**: This is a demonstration project.

The backend accepts raw private keys in requests for convenience only. For production:
- Use client-side wallet signing (e.g., Petra wallet)
- Implement proper authentication
- Never store private keys on servers
- Enable HTTPS/TLS
- Add rate limiting

## Use Cases

- Personal status messages
- Decentralized announcements
- Proof-of-existence timestamps
- On-chain signatures
- Blog/diary entries

## Learn More

- [Aptos Documentation](https://aptos.dev)
- [Move Language Reference](https://aptos.dev/move)
- [Aptos Explorer](https://explorer.aptoslabs.com)

## Contributing

Feel free to submit issues, fork the repository, and create pull requests!

## License

This project is open source and available under the MIT License.

---

Made with love for the Aptos ecosystem
