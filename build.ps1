# Quick build script for aipage Chrome Extension (Windows)

Write-Host "🔨 Building aipage Chrome Extension..." -ForegroundColor Green
Write-Host ""

# Check if Docker is installed
$dockerInstalled = Get-Command docker -ErrorAction SilentlyContinue
if (-not $dockerInstalled) {
    Write-Host "❌ Docker is not installed. Please install Docker first." -ForegroundColor Red
    Write-Host "Visit: https://docs.docker.com/get-docker/"
    exit 1
}

# Check if Docker Compose is installed
$composeInstalled = Get-Command docker-compose -ErrorAction SilentlyContinue
if (-not $composeInstalled) {
    Write-Host "❌ Docker Compose is not installed." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Docker is installed" -ForegroundColor Green
Write-Host ""

# Build the extension
Write-Host "🔨 Building extension..." -ForegroundColor Cyan
docker-compose --profile build up build-once

Write-Host ""
Write-Host "✅ Build complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📦 Your extension is ready in the ./build folder" -ForegroundColor Yellow
Write-Host ""
Write-Host "To load in Chrome:"
Write-Host "1. Open chrome://extensions/"
Write-Host "2. Enable 'Developer mode'"
Write-Host "3. Click 'Load unpacked'"
Write-Host "4. Select the ./build folder"
Write-Host ""

