# 🎵 F.LUFS - Audio Discovery & Playback Interface

A modern, Spotify-like web interface for discovering and playing sounds from [Freesound.org](https://freesound.org). Built with vanilla JavaScript and Web Audio API, F.LUFS provides an intuitive way to search, preview, and download high-quality audio samples.

## Features

### 🎯 Core Functionality
- **Audio Discovery**: Search Freesound with intelligent filtering (keywords, duration range)
- **Real-time Playback**: Built-in Web Audio API player with progress tracking
- **Smart Downloads**: Download sounds as high-quality WAV files directly to your browser
- **Metadata Display**: View detailed information about each sound (artist, license, duration, sample rate, etc.)
- **Tag System**: Browse sounds by tags and curated categories
- **Responsive Layout**: Fixed header/footer with scrollable content area

### 🎨 UI/UX Features
- Beautiful gradient dark theme (inspired by Spotify/Splice)
- Waveform visualization for selected sounds
- Duration range slider with dual-thumb controls
- Sound card grid with compact preview info
- Right sidebar with download, metadata, and stats panels
- Footer player with transport controls and progress bar
- Enter key support for quick searching

### 📊 Statistics & Info
- Real-time search statistics (sounds found, downloaded, total duration, average duration)
- Sound metadata including artist, license, sample rate, channels, downloads
- Sound descriptions and tag collections
- Current playback status and selected sound info

## Getting Started

### Prerequisites
- Web browser with Web Audio API support (Chrome, Firefox, Safari, Edge)
- Freesound API key ([get one here](https://freesound.org/api/apply))

### Quick Start

1. **Clone the repository**
   ```bash
   git clone git@github.com:danialrami/f-lufs.git
   cd f-lufs
   npm install
   ```

2. **Create `.env` file** (see [Setup](#setup) section)

3. **Start development server**
   ```bash
   npm start
   ```

4. **Open in browser**
   ```
   http://localhost:8080/premium_interface.html
   ```

## Setup

### Environment Configuration

Create a `.env` file in the project root:

```env
# Freesound API Configuration
FREESOUND_CLIENT_ID=your_client_id
FREESOUND_CLIENT_SECRET_API_KEY=your_api_key

# Application Settings
LIBRARY_PATH=/path/to/your/samples
CONFIG_PATH=~/.flufs

# Environment
NODE_ENV=development

# API Rate Limiting
REQUEST_TIMEOUT_MS=5000
MAX_RETRIES=3
```

**⚠️ Important**: The `.env` file is in `.gitignore` and will never be committed to version control.

### Getting Your Freesound API Key

1. Visit [freesound.org](https://freesound.org)
2. Create an account or log in
3. Go to [Developer Settings](https://freesound.org/api/apply)
4. Create a new application
5. Copy your API key and add it to `.env`

## Usage

### Web Interface

1. **Search**: Enter keywords in the search box (e.g., "drum", "ambient", "piano")
2. **Filter by Duration**: Use the dual-slider to set min/max duration (0.1s - 60s)
3. **Click Search**: Results appear in the grid below
4. **Select Sound**: Click any sound card to view details and waveform
5. **Play**: Click the play button to listen (using Web Audio API)
6. **Download**: Click the download button to save as WAV file

### Advanced Features

#### Search Panel
- **Search Terms**: Enter multiple keywords (space-separated)
- **Duration Range**: Adjust sliders for precise control
- Real-time range display (e.g., "0.5s - 10.0s")

#### Player Controls
- **Play (▶️)**: Start playback of selected sound
- **Pause (⏸️)**: Pause current playback
- **Stop (⏹️)**: Stop playback and reset position
- **Progress Bar**: Drag to seek to any position
- **Time Display**: Current time / Total duration

#### Sidebar Panels
- **⬇️ Download**: Save selected sound as WAV
- **ℹ️ Sound Info**: View metadata (ID, duration, artist, channels, sample rate)
- **📊 Status**: Real-time operation status and logging
- **📈 Stats**: Query results and audio statistics

## Architecture

### Project Structure

```
f-lufs/
├── src/
│   ├── client/           # Browser-specific code
│   ├── server/           # Node.js server code  
│   └── common/           # Shared utilities
├── premium_interface.html # Main web interface
├── simple-freesound.umd.js # Bundled library
├── package.json          # Dependencies and scripts
└── README.md            # This file
```

### Technology Stack

- **Frontend**: Vanilla JavaScript + HTML/CSS
- **Audio**: Web Audio API (playback + WAV encoding)
- **API**: Freesound.org REST API
- **Styling**: CSS gradients, flexbox, grid
- **Build**: Babel transpilation, browserify bundling

### Key Components

1. **Search Panel** (`search-controls-panel`)
   - Text input for keywords
   - Dual-slider for duration range
   - Search button with icon

2. **Featured Panel** (`featured-panel`)
   - Artwork display
   - Sound metadata (6-item grid)
   - Description and tags
   - Waveform visualization

3. **Results Grid** (`results-container`)
   - Sound cards with previews
   - Compact metadata display
   - Click to select and play

4. **Player Footer** (`player-footer`)
   - Sound artwork and info
   - Progress bar with timeline
   - Transport controls (play/pause/stop)
   - Time display

5. **Sidebar Panels** (right column)
   - Download button
   - Sound metadata display
   - Status/logging panel
   - Statistics dashboard

## Development

### Available Scripts

```bash
# Build minified browser bundle
npm run bundle

# Watch and rebuild on changes
npm run watch

# Transpile ES6 to ES5
npm run transpile

# Run tests
npm test

# Generate JSDoc documentation
npm run doc

# Start development server
npm start
```

### Building

The project uses Babel for ES6 transpilation and Browserify for bundling:

```bash
npm run bundle  # Creates simple-freesound.umd.js and .min.js
```

This outputs:
- `simple-freesound.umd.js` - Full UMD bundle
- `simple-freesound.min.js` - Minified version

## API Integration

### Query Parameters

The Freesound API integration supports:

| Parameter | Type | Example | Notes |
|-----------|------|---------|-------|
| `search` | String | "drum bass" | Space-separated keywords |
| `duration` | [min, max] | [0.5, 10] | Duration in seconds |
| `sort` | String | "downloads_desc" | Sort by downloads, rating, etc. |

### Rate Limiting

- Default timeout: 5000ms
- Max retries: 3
- Configure in `.env` via `REQUEST_TIMEOUT_MS` and `MAX_RETRIES`

## Browser Compatibility

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome | ✅ Full | Recommended |
| Firefox | ✅ Full | Recommended |
| Safari | ✅ Full | WebKit prefix for some APIs |
| Edge | ✅ Full | Chromium-based |
| IE 11 | ❌ No | ES6 transpilation needed |

## Performance Tips

1. **Search Optimization**
   - Use specific keywords for better results
   - Narrow duration range to filter results
   - Results limit: typically 15 sounds per query

2. **Download Management**
   - WAV conversion happens in-browser (CPU intensive)
   - Use browser's download manager for large batches
   - Audio quality: HQ MP3 preview (~320kbps)

3. **Memory Usage**
   - Web Audio buffers remain in memory while playing
   - Close tab to free audio memory
   - Large batch downloads may require more RAM

## Troubleshooting

### "API key not found"
- Ensure `.env` file exists in project root
- Check `FREESOUND_CLIENT_SECRET_API_KEY` is set
- Verify key format and validity

### "No sounds found"
- Try different/broader search terms
- Expand duration range
- Check your Freesound account has API access

### "Download failed"
- Check browser storage quota
- Verify network connectivity
- Try in incognito mode (may help with cache issues)

### "Audio not playing"
- Verify browser supports Web Audio API
- Check browser audio is unmuted
- Try another sound/search

## License

BSD-3-Clause - See LICENSE file for details

Original library by Joseph Larralde (Ircam-RnD)  
F.LUFS interface by Daniel Ramirez

## Resources

- [Freesound API Documentation](https://freesound.org/docs/api/)
- [Web Audio API Reference](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [GitHub Repository](https://github.com/danialrami/f-lufs)
- [Project Issues](https://github.com/danialrami/f-lufs/issues)

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for suggestions and bug reports.

---

**Made with 🎵 and ☕ by Daniel Ramirez**
