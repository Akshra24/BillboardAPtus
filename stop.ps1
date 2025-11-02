# Billboard Stop Script
# This script stops all Billboard-related Node.js processes

Write-Host "🛑 Stopping Aptos Billboard..." -ForegroundColor Yellow
Write-Host ""

# Find and stop Node.js processes
$processes = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object {
    $_.Path -like "*node.exe"
}

if ($processes) {
    Write-Host "Found $($processes.Count) Node.js process(es)" -ForegroundColor Gray
    
    foreach ($process in $processes) {
        try {
            # Try to gracefully terminate first
            Write-Host "   Stopping process PID $($process.Id)..." -ForegroundColor Gray
            $process.Kill()
            Start-Sleep -Milliseconds 500
            
            # Check if still running
            if (-not $process.HasExited) {
                Write-Host "   Force killing process PID $($process.Id)..." -ForegroundColor Yellow
                Stop-Process -Id $process.Id -Force
            }
        } catch {
            Write-Host "   Failed to stop process PID $($process.Id)" -ForegroundColor Red
        }
    }
    
    Write-Host ""
    Write-Host "✅ All Billboard processes stopped" -ForegroundColor Green
} else {
    Write-Host "No running Node.js processes found" -ForegroundColor Gray
}

# Verify port 8080 is free
Start-Sleep -Seconds 1
$portCheck = netstat -ano | Select-String ":8080"

if ($portCheck) {
    Write-Host ""
    Write-Host "⚠️  Warning: Port 8080 is still in use:" -ForegroundColor Yellow
    Write-Host $portCheck -ForegroundColor Gray
} else {
    Write-Host ""
    Write-Host "✅ Port 8080 is now free" -ForegroundColor Green
}

Write-Host ""


