# Billboard Startup Script
# This script starts the backend server and opens the frontend in your browser

Write-Host "🎬 Starting Aptos Billboard..." -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Navigate to backend directory
$backendDir = Join-Path $PSScriptRoot "backend"
if (-not (Test-Path $backendDir)) {
    Write-Host "❌ Error: Backend directory not found at $backendDir" -ForegroundColor Red
    exit 1
}

Set-Location $backendDir

# Check if dependencies are installed
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Start the server in a new window
Write-Host "🚀 Starting backend server..." -ForegroundColor Yellow
Write-Host "📍 Server will be available at: http://127.0.0.1:8080" -ForegroundColor Cyan
Write-Host ""

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendDir'; node index.js" -WindowStyle Minimized

# Wait for server to start
Write-Host "⏳ Waiting for server to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 4

# Check if server is running
try {
    $response = Invoke-WebRequest -Uri "http://127.0.0.1:8080/health" -UseBasicParsing -TimeoutSec 5
    $health = $response.Content | ConvertFrom-Json
    Write-Host "✅ Server is running!" -ForegroundColor Green
    Write-Host "   Status: $($health.status)" -ForegroundColor Gray
    Write-Host "   Network: $($health.node)" -ForegroundColor Gray
    Write-Host ""
    
    # Open browser
    Write-Host "🌐 Opening browser..." -ForegroundColor Yellow
    Start-Process "http://127.0.0.1:8080/index.html"
    
    Write-Host ""
    Write-Host "🎉 Billboard is now running!" -ForegroundColor Green
    Write-Host "   Frontend: http://127.0.0.1:8080/index.html" -ForegroundColor Cyan
    Write-Host "   API Health: http://127.0.0.1:8080/health" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Press Ctrl+C to stop monitoring. The server window will remain open." -ForegroundColor Gray
    
    # Keep running to show server output
    while ($true) {
        Start-Sleep -Seconds 30
        try {
            Invoke-WebRequest -Uri "http://127.0.0.1:8080/health" -UseBasicParsing -TimeoutSec 5 | Out-Null
        } catch {
            Write-Host "⚠️  Server appears to have stopped" -ForegroundColor Red
            break
        }
    }
} catch {
    Write-Host "❌ Failed to start server or server not responding" -ForegroundColor Red
    Write-Host "Check the server window for errors" -ForegroundColor Yellow
    exit 1
}

