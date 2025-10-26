# Quick start script for aipage Chrome Extension development (Windows)

Write-Host "🚀 Starting aipage development environment..." -ForegroundColor Green
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

# Build and start development container
Write-Host "🔨 Building and starting development container..." -ForegroundColor Cyan
docker-compose up dev

# The script will keep running until you press Ctrl+C

