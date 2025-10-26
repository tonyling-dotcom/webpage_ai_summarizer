# aipage - AI-Powered Text Extraction Chrome Extension

Extract and view all text from any webpage with a single click, powered by OpenAI!

## Features

- 📄 **One-Click Extraction**: Button appears on every webpage (top-left corner)
- ✨ **AI-Powered Summaries**: Generate intelligent summaries using OpenAI's GPT-4o-mini
- 💾 **Local Storage**: Maintains extraction count and API key securely
- 📋 **Copy to Clipboard**: Easy text copying functionality
- ⚙️ **Simple API Key Setup**: Secure settings panel to configure your OpenAI API key
- 🎨 **Clean & Minimal UI**: Modern, responsive design with smooth animations
- 📊 **Usage Tracking**: Keeps track of how many times you've extracted text

## Installation

### Option 1: Using Docker (Recommended)

1. Build the extension using Docker:
   ```bash
   docker-compose --profile build up build-once
   ```

2. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in the top right)
   - Click "Load unpacked"
   - Select the `build` folder from this project

See [DOCKER_SETUP.md](DOCKER_SETUP.md) for detailed Docker instructions.

### Option 2: Using Node.js directly

1. Build the extension:
   ```bash
   npm install
   npm run build
   ```

2. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in the top right)
   - Click "Load unpacked"
   - Select the `build` folder from this project

## Usage

### Setting Up OpenAI API Key

1. **Get your OpenAI API key**:
   - Visit [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create an API key if you don't have one

2. **Configure in Extension**:
   - Click the aipage extension icon in your Chrome toolbar
   - Click the ⚙️ (Settings) button in the header
   - Enter your OpenAI API key (starts with `sk-...`)
   - Click "Save"

### Extracting and Summarizing Text

1. **Extract Text from a Page**:
   - Visit any webpage
   - Look for the "📄 Extract Text" button in the top-left corner
   - Click the button to extract all text from the page
   - A popup window will appear showing the extracted text

2. **Generate AI Summary**:
   - In the popup window, click "✨ Generate AI Summary"
   - Wait a few seconds while the AI processes the text
   - The summary will appear at the top of the extracted text
   - The summary is concise and highlights key points

3. **Copy Text**:
   - Click the "📋 Copy Text" button to copy all extracted text to clipboard

4. **View History**:
   - Click the aipage extension icon in your Chrome toolbar
   - View your extraction count and last extraction details

## Development

### Using Docker

- **Start development server with hot reload**:
  ```bash
  docker-compose up dev
  ```

- **Build for production**:
  ```bash
  docker-compose --profile build up build-once
  ```

- **View logs**:
  ```bash
  docker-compose logs -f dev
  ```

See [DOCKER_SETUP.md](DOCKER_SETUP.md) for more Docker commands.

### Using Node.js directly

- **Start development server**:
  ```bash
  npm start
  ```

- **Build for production**:
  ```bash
  npm run build
  ```

## Project Structure

```
chrome-boiler/
├── src/
│   ├── manifest.json          # Extension manifest
│   ├── pages/
│   │   ├── Background/        # Background service worker
│   │   ├── Content/           # Content script (adds button to pages)
│   │   └── Popup/             # Extension popup UI
│   └── assets/                # Icons and images
├── build/                     # Built extension (load this in Chrome)
└── webpack.config.js          # Build configuration
```

## Permissions

The extension requires:
- **storage**: To save extraction count, OpenAI API key, and text data locally
- **activeTab**: To access and extract text from the current webpage

## AI Features

This extension uses **OpenAI's GPT-4o-mini model** to generate intelligent summaries:
- Fast and cost-effective
- Automatically truncates long texts (max ~12,000 characters)
- Generates summaries up to 500 tokens
- Your API key is stored securely in Chrome's local storage
- No text is stored on external servers except for OpenAI API calls

## Tech Stack

- React 18
- Webpack 5
- Chrome Extension Manifest V3
- Chrome Storage API
- OpenAI API (GPT-4o-mini)

## License

MIT
