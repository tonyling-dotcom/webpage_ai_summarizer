#!/bin/bash

# Quick start script for aipage Chrome Extension development

echo "🚀 Starting aipage development environment..."
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

# Build and start development container
echo "🔨 Building and starting development container..."
docker-compose up dev

# The script will keep running until you press Ctrl+C

