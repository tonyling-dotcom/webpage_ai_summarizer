#!/bin/bash

# Quick build script for aipage Chrome Extension

echo "🔨 Building aipage Chrome Extension..."
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed."
    exit 1
fi

echo "✅ Docker is installed"
echo ""

# Build the extension
echo "🔨 Building extension..."
docker-compose --profile build up build-once

echo ""
echo "✅ Build complete!"
echo ""
echo "📦 Your extension is ready in the ./build folder"
echo ""
echo "To load in Chrome:"
echo "1. Open chrome://extensions/"
echo "2. Enable 'Developer mode'"
echo "3. Click 'Load unpacked'"
echo "4. Select the ./build folder"
echo ""

