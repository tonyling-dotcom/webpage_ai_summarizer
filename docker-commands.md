# Docker Commands for aipage Chrome Extension

## Development

### Start development server with hot reload
```bash
docker-compose up dev
```

This will:
- Start the webpack dev server
- Watch for file changes
- Auto-rebuild on changes
- Output to `./build` folder

### Stop development server
```bash
docker-compose down
```

## Building the Extension

### Build once
```bash
docker-compose --profile build up build-once
```

### Build for production
```bash
docker-compose --profile production up build
```

### Build without Docker Compose (using Docker directly)
```bash
# Development build
docker build -t aipage:dev .
docker run -v $(pwd)/build:/app/build aipage:dev npm run build

# Production build
docker build -f Dockerfile.prod -t aipage:prod .
docker run -v $(pwd)/build:/app/build aipage:prod
```

## Useful Commands

### Rebuild containers (after changing Dockerfile)
```bash
docker-compose build
```

### View logs
```bash
docker-compose logs -f dev
```

### Run commands inside container
```bash
docker-compose exec dev sh
```

### Clean up everything
```bash
docker-compose down -v
docker system prune -a
```

### Install new npm packages
```bash
# Add to package.json first, then:
docker-compose build dev
```

## Loading the Extension in Chrome

1. Build the extension:
   ```bash
   docker-compose --profile build up build-once
   ```

2. Open Chrome and go to `chrome://extensions/`

3. Enable "Developer mode"

4. Click "Load unpacked"

5. Select the `build/` folder from your project

## File Structure

```
aipage/
├── src/                  # Source code (mounted in dev mode)
├── build/               # Built extension (created by Docker)
├── Dockerfile           # Development Dockerfile
├── Dockerfile.prod      # Production Dockerfile
├── docker-compose.yml   # Docker Compose configuration
├── .dockerignore       # Files to exclude from Docker build
├── .gitignore          # Files to exclude from Git
└── .env.example        # Example environment variables
```

## Troubleshooting

### Port already in use
```bash
# Find and kill the process using port 3000
lsof -ti:3000 | xargs kill -9
```

### Permission issues with build folder
```bash
sudo chown -R $USER:$USER ./build
```

### Node modules issues
```bash
# Rebuild everything
docker-compose down -v
docker-compose build --no-cache
docker-compose up dev
```

