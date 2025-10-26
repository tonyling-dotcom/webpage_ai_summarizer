# Docker Setup Guide for aipage

## 🐳 Quick Start

### Prerequisites
- Docker installed ([Get Docker](https://docs.docker.com/get-docker/))
- Docker Compose installed (usually comes with Docker Desktop)

### 1. Clone and Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd chrome-boiler

# The .gitignore and .dockerignore are already configured
# Your API keys and node_modules won't be committed or included in Docker images
```

### 2. Development Mode (with hot reload)

```bash
# Start development server
docker-compose up dev

# The extension will be built and available in ./build folder
# Any changes to src/ will trigger a rebuild
```

### 3. Build the Extension

```bash
# One-time build
docker-compose --profile build up build-once

# The built extension will be in ./build folder
```

### 4. Load in Chrome

1. Open Chrome → `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `build/` folder

## 📁 Project Structure

```
chrome-boiler/
├── src/                    # Source code (your extension code)
├── build/                  # Built extension (gitignored)
├── node_modules/           # Dependencies (gitignored)
├── Dockerfile              # Development container
├── Dockerfile.prod         # Production build container
├── docker-compose.yml      # Docker services configuration
├── .gitignore             # Git ignore rules
├── .dockerignore          # Docker ignore rules
└── docker-commands.md     # Detailed Docker commands
```

## 🔒 Security - What's Protected

### .gitignore prevents these from being committed:
- ✅ `node_modules/` - Dependencies
- ✅ `build/` - Built files
- ✅ `.env*` - Environment variables
- ✅ `secrets.*.js` - Secret files
- ✅ `*.log` - Log files
- ✅ `*.pem`, `*.crx` - Extension keys
- ✅ IDE files (`.vscode/`, `.idea/`)

### .dockerignore prevents these from entering Docker images:
- ✅ `node_modules/` - Will be installed fresh
- ✅ `build/` - Will be created in container
- ✅ `.env*` - Environment variables
- ✅ `.git/` - Git history
- ✅ IDE files
- ✅ Documentation files

## 🛠️ Common Tasks

### Development with Live Reload
```bash
# Start
docker-compose up dev

# Stop (Ctrl+C, then:)
docker-compose down
```

### Build for Production
```bash
# Build the extension
docker-compose --profile build up build-once

# Or using npm directly (if you prefer)
npm run build
```

### View Logs
```bash
docker-compose logs -f dev
```

### Access Container Shell
```bash
docker-compose exec dev sh
```

### Rebuild After Dependency Changes
```bash
# If you modify package.json
docker-compose build dev
docker-compose up dev
```

### Clean Everything
```bash
# Remove containers and volumes
docker-compose down -v

# Remove all Docker images
docker system prune -a
```

## 🔑 Environment Variables

Create a `.env` file in the root (it's gitignored):

```bash
# .env (create this file - it won't be committed)
NODE_ENV=development
PORT=3000
```

**Important**: OpenAI API keys are NOT stored in .env. Users enter them directly in the extension settings, and they're stored in Chrome's local storage.

## 🚨 Troubleshooting

### Port 3000 already in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or change port in docker-compose.yml
```

### Permission issues with build folder
```bash
sudo chown -R $USER:$USER ./build
```

### Changes not reflecting
```bash
# Rebuild containers
docker-compose down
docker-compose build --no-cache
docker-compose up dev
```

### Node modules issues
```bash
# Remove volumes and rebuild
docker-compose down -v
rm -rf node_modules
docker-compose build
docker-compose up dev
```

## 📝 Best Practices

1. **Never commit sensitive data**
   - API keys go in Chrome extension settings (not .env)
   - Use `.env.local` for local overrides (gitignored)

2. **Keep Docker images clean**
   - .dockerignore is configured properly
   - Only necessary files are copied

3. **Development workflow**
   ```bash
   # Day-to-day development
   docker-compose up dev  # Start dev server
   # Make changes in src/
   # Extension auto-rebuilds
   # Reload extension in Chrome
   ```

4. **Production builds**
   ```bash
   docker-compose --profile build up build-once
   # Load build/ folder in Chrome
   ```

## 🔄 Updating Dependencies

```bash
# Add new package
npm install <package-name>

# Rebuild container
docker-compose build dev
docker-compose up dev
```

## 📦 Deployment

For production deployment or distribution:

```bash
# Build optimized extension
docker-compose --profile production up build

# The build/ folder contains your complete extension
# Zip it for Chrome Web Store
cd build && zip -r ../aipage-extension.zip . && cd ..
```

## 🎯 Quick Commands Reference

| Command | Purpose |
|---------|---------|
| `docker-compose up dev` | Start development server |
| `docker-compose down` | Stop all services |
| `docker-compose --profile build up build-once` | Build extension once |
| `docker-compose logs -f dev` | View logs |
| `docker-compose exec dev sh` | Access container shell |
| `docker-compose build` | Rebuild containers |
| `docker system prune -a` | Clean up Docker |

## ✅ Checklist Before Pushing to GitHub

- [ ] `.gitignore` is in place
- [ ] `.dockerignore` is in place  
- [ ] No `.env` files committed
- [ ] No `node_modules/` committed
- [ ] No `build/` folder committed
- [ ] No API keys in code
- [ ] No `*.pem` or `*.crx` files committed

Your repository is now secure! 🔒

