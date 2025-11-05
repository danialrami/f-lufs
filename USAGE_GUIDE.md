# simple-freesound Usage Guide

This is a library that provides an intuitive interface to query and download sounds from [Freesound.org](https://freesound.org) via their API. It works in both Node.js (server) and browser (client) environments.

## Getting Your API Key

1. Go to [freesound.org](https://freesound.org)
2. Create an account or log in
3. Navigate to your developer settings at [freesound.org/api/apply](https://freesound.org/api/apply)
4. Create a new application to get your API key (referred to as "Client Secret" in the Freesound docs)

## Setting Up Environment Variables

This project uses environment variables to store sensitive credentials. Create or update your `.env` file in the project root with the following:

```env
# Freesound API Configuration
FREESOUND_CLIENT_ID=your_client_id_here
FREESOUND_CLIENT_SECRET_API_KEY=your_api_key_here

# Application Settings
LIBRARY_PATH=/path/to/your/download/folder
CONFIG_PATH=~/.flufs

# Environment
NODE_ENV=development

# API Rate Limiting
REQUEST_TIMEOUT_MS=5000
MAX_RETRIES=3
```

**Important: The `.env` file is in `.gitignore` and will never be committed to version control.**

## Server-Side Usage (Node.js)

The server-side implementation (`server/SimpleFreesound`) downloads files to disk and is designed for Node.js environments.

### Basic Setup

```javascript
import SimpleFreesound from 'simple-freesound';
import { apiKey, downloadFolder } from './test/constants.js';

const sf = new SimpleFreesound(apiKey, {
  destination: downloadFolder,
  publicPath: 'public',           // base folder for downloads
  storeSoundsInfo: false          // cache all results (memory intensive)
});
```

### Query Sounds

Search for sounds by terms, duration, or username:

```javascript
sf.query({
  search: ['drum', 'bass'],
  duration: [0.01, 1],            // [minSeconds, maxSeconds]
  username: ['some_user'],        // optional: filter by uploader
  users: ['some_user'],           // alias for username
  packs: ['some_pack']            // optional: filter by pack
})
.then(() => {
  console.log('Query complete! Found sounds:', sf.currentSoundsInfo);
})
.catch(error => {
  console.error('Query failed:', error);
});
```

### Download Sounds

After querying, download the HQ MP3 previews:

```javascript
sf.query({
  search: ['space', 'ambient'],
  duration: [1, 20]
})
.then(() => sf.download())
.then(() => {
  console.log('Download complete!');
  console.log(sf.currentSoundsInfo);  // metadata of downloaded sounds
})
.catch(error => {
  console.error('Download failed:', error);
});
```

### Query and Download in One Step

```javascript
sf.queryAndDownload({
  search: ['piano'],
  duration: [0, 5]
})
.then(() => {
  console.log('All sounds downloaded to:', downloadFolder);
})
.catch(error => {
  console.error('Query and download failed:', error);
});
```

### Get Sound Details by ID

If you have specific sound IDs:

```javascript
sf.queryFromIds([123456, 234567])
  .then(() => {
    console.log('Sound details retrieved:', sf.currentSoundsInfo);
  })
  .catch(error => {
    console.error('Failed to get sound details:', error);
  });
```

### Access Sound Information

After querying, access metadata for each sound:

```javascript
const soundsInfo = sf.currentSoundsInfo;

// Each sound entry contains:
// {
//   id: 123456,
//   name: "sound name",
//   url: "freesound.org url",
//   duration: 3.5,
//   username: "uploader_name",
//   previews: {
//     "preview-hq-mp3": "https://preview-url..."
//   },
//   localUrl: "path/to/file/123456.mp3"  // added after download
// }

for (const [soundId, info] of Object.entries(soundsInfo)) {
  console.log(`${soundId}: ${info.name} (${info.duration}s) - ${info.localUrl}`);
}
```

### File I/O

Save and load sound information to/from JSON:

```javascript
// Save all queried sounds to file
sf.writeToFile('soundsInfo.json');

// Later, restore from file
sf.readFromFile('soundsInfo.json');

// Now you can query details for these sounds without hitting the API again
sf.queryAndDownload({
  search: ['drums']
})
.then(() => sf.download())
.then(() => {
  console.log('Sounds downloaded successfully');
});
```

### Clear Cache

```javascript
sf.clear();  // clears currentSoundsInfo
```

---

## Browser Usage

The browser implementation (`client/SimpleFreesound`) stores downloaded audio as in-memory AudioBuffers instead of saving to disk.

### Include the Library

```html
<script src="simple-freesound.min.js"></script>

<script>
  var apiKey = "your_api_key_here";
  var sf = new simpleFreesound.SimpleFreesound(apiKey, false);
  
  // Query sounds
  sf.query({
    search: ['drum', 'bass'],
    duration: [0.01, 1]
  });
</script>
```

### Download and Play

```javascript
sf.queryAndDownload({
  search: ['sound'],
  duration: [1, 5]
})
.then(() => {
  // Access downloaded audio buffers
  const buffers = sf.buffers;
  
  // Access sound metadata
  const soundInfo = sf.currentSoundsInfo;
  
  // Play the first sound
  playSound(buffers[0]);
});

function playSound(audioBuffer) {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(audioContext.destination);
  source.start(0);
}
```

### Access Buffers

```javascript
// After download, buffers are accessible:
const audioBuffers = sf.buffers;  // Array of AudioBuffer objects

// Each buffer can be played with Web Audio API
audioBuffers.forEach((buffer, index) => {
  console.log(`Buffer ${index}: ${buffer.duration}s`);
});
```

---

## Query Parameters Reference

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `search` | Array<String> | Search terms (joined with space) | `['drum', 'bass']` |
| `duration` | Array<Number> | `[minSeconds, maxSeconds]` | `[0.5, 10]` or `[1, '*']` for unlimited max |
| `username` / `users` | Array<String> | Filter by uploader usernames | `['artist_name']` |
| `packs` | Array<String> | Filter by pack names | `['pack_name']` |

---

## Available Methods

### Server Class (`server/SimpleFreesound`)

| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| `query(queryParams)` | Object | Promise | Search for sounds matching parameters |
| `queryFromIds(ids)` | Array<Number> | Promise | Get details for specific sound IDs |
| `download(ids?)` | Array<Number> \| null | Promise | Download HQ MP3 previews to disk |
| `queryAndDownload(queryParams)` | Object | Promise | Search and download in one call |
| `readFromFile(filename)` | String | void | Load sound info from JSON file |
| `writeToFile(filename)` | String | void | Save sound info to JSON file |
| `clear()` | none | void | Clear cached data |

### Client Class (`client/SimpleFreesound`)

| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| `query(queryParams)` | Object | Promise | Search for sounds matching parameters |
| `queryFromIds(ids)` | Array<Number> | Promise | Get details for specific sound IDs |
| `download(ids?)` | Array<Number> \| null | Promise | Download HQ MP3 previews as AudioBuffers |
| `queryAndDownload(queryParams)` | Object | Promise | Search and download in one call |
| `clear()` | none | void | Clear cached data |

### Properties

**Server:**
- `currentSoundsInfo` (Object) - Metadata from last query/download
- `soundsInfo` (Object) - All cached results (if `storeSoundsInfo: true`)
- `destination` (String) - Download destination path
- `publicPath` (String) - Base public path

**Client:**
- `currentSoundsInfo` (Object) - Metadata from last query/download
- `soundsInfo` (Object) - All cached results (if storeSoundsInfo true)
- `buffers` (Array<AudioBuffer>) - Downloaded audio buffers

---

## Building & Development

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
```

### Project Structure

```
simple-freesound/
├── src/
│   ├── client/           # Browser implementation
│   ├── server/           # Node.js implementation
│   └── common/           # Shared code
├── test/
│   ├── basic_tests.js    # Test suite
│   └── constants.js      # Environment variables (from .env)
├── bin/                  # Build scripts
├── docs/                 # Generated JSDoc
├── .env                  # Environment variables (git ignored)
└── USAGE_GUIDE.md        # This file
```

---

## Tips & Best Practices

### 1. API Rate Limiting
Freesound has rate limits on their API. Check their [API documentation](https://freesound.org/docs/api/overview.html) for current limits. Consider adding delays between requests for large batch operations.

### 2. Use `storeSoundsInfo` Wisely
- Set to `true` only if you need to access previous results multiple times
- It caches all sound metadata in memory, which can consume significant RAM with large queries
- Default `false` is recommended for most use cases

### 3. Error Handling
Always handle promise rejections:

```javascript
sf.query({ search: ['test'] })
  .catch(error => {
    console.error('Query failed:', error.message);
  });
```

### 4. Server Downloads
- Downloaded files are saved to `${publicPath}/${destination}/`
- Filenames are formatted as `{soundId}.mp3`
- Access path is stored in sound info as `localUrl`

### 5. Browser Security
- API keys exposed in browser code can be intercepted
- For production, implement a backend proxy that:
  - Accepts query parameters from the browser
  - Handles API calls server-side
  - Returns only necessary data to the client

### 6. Batch Operations
For downloading many sounds, consider processing in batches:

```javascript
const soundIds = [1, 2, 3, 4, 5];
const batchSize = 5;

for (let i = 0; i < soundIds.length; i += batchSize) {
  const batch = soundIds.slice(i, i + batchSize);
  
  await sf.queryFromIds(batch)
    .then(() => sf.download(batch))
    .catch(error => console.error(`Batch failed:`, error));
}
```

---

## Environment Variables Reference

Store these in your `.env` file (not in version control):

| Variable | Description | Example |
|----------|-------------|---------|
| `FREESOUND_CLIENT_ID` | Your Freesound application client ID | `Zq9fzuS0fEXQWY7LfjIT` |
| `FREESOUND_CLIENT_SECRET_API_KEY` | Your Freesound API key | `4YST5apu7d956qSx6Zdf7NmZV7yrP9b5XMelqMdd` |
| `LIBRARY_PATH` | Where to download/store sound files | `/Users/username/Samples/freesound` |
| `NODE_ENV` | Environment mode | `development` or `production` |
| `REQUEST_TIMEOUT_MS` | API request timeout in milliseconds | `5000` |
| `MAX_RETRIES` | Maximum retry attempts for failed requests | `3` |

---

## Troubleshooting

### "API key not found in .env file"
- Ensure `.env` file exists in the project root
- Check that `FREESOUND_CLIENT_SECRET_API_KEY` is set
- Verify the API key is valid (not expired)

### "Invalid API key"
- Double-check your API key in `.env`
- Visit freesound.org/api/apply to verify your key is still active
- Keys may expire if your app is inactive

### "No sounds found"
- Verify your search terms are valid
- Check duration filters - may be too restrictive
- Increase result limit by querying with broader terms

### "Download failed"
- Ensure `LIBRARY_PATH` directory exists and is writable
- Check disk space is available
- Verify network connectivity
- Check that sound preview URLs are still valid

---

## Resources

- [Freesound API Documentation](https://freesound.org/docs/api/)
- [Web Audio API Reference](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [Project Repository](https://github.com/Ircam-RnD/simple-freesound)
