require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from root directory
app.use(express.static(path.join(__dirname, '..')));

// Check for required environment variables
if (!process.env.FREESOUND_CLIENT_SECRET_API_KEY) {
  console.error('Error: FREESOUND_CLIENT_SECRET_API_KEY is not set in .env file');
  process.exit(1);
}

const API_KEY = process.env.FREESOUND_CLIENT_SECRET_API_KEY;
const FREESOUND_API_BASE = 'https://freesound.org/apiv2';
const REQUEST_TIMEOUT = parseInt(process.env.REQUEST_TIMEOUT_MS) || 5000;
const MAX_RETRIES = parseInt(process.env.MAX_RETRIES) || 3;

/**
 * Retry logic for API requests
 */
async function fetchWithRetry(url, options = {}, retries = 0) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      timeout: REQUEST_TIMEOUT,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`Freesound API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeout);

    if (retries < MAX_RETRIES) {
      console.log(`Retry attempt ${retries + 1}/${MAX_RETRIES} for ${url}`);
      await new Promise(resolve => setTimeout(resolve, 1000 * (retries + 1)));
      return fetchWithRetry(url, options, retries + 1);
    }

    throw error;
  }
}

/**
 * POST /api/search
 * Proxy endpoint for Freesound sound search
 * Body: { search: [...], duration: [min, max] }
 */
app.post('/api/search', async (req, res) => {
  try {
    const { search, duration } = req.body;

    if (!search || !Array.isArray(search) || search.length === 0) {
      return res.status(400).json({ error: 'search parameter is required and must be a non-empty array' });
    }

    if (!duration || !Array.isArray(duration) || duration.length !== 2) {
      return res.status(400).json({ error: 'duration parameter is required and must be [min, max]' });
    }

    // Build query string
    const searchTerms = search.join(' ');
    const [minDuration, maxDuration] = duration;

    const params = new URLSearchParams({
      query: searchTerms,
      filter: `duration:[${minDuration} TO ${maxDuration}]`,
      fields: 'id,name,duration,username,num_downloads,filesize,bitrate,channels,images,tags',
      page_size: 15,
      sort: 'score',
      token: API_KEY,
    });

    const url = `${FREESOUND_API_BASE}/search/text/?${params.toString()}`;
    console.log(`[SEARCH] Query: "${searchTerms}", Duration: ${minDuration}-${maxDuration}s`);

    const data = await fetchWithRetry(url);

    res.json({
      count: data.count,
      results: data.results || [],
    });
  } catch (error) {
    console.error('[SEARCH ERROR]', error.message);
    res.status(500).json({
      error: 'Search failed',
      message: error.message,
    });
  }
});

/**
 * POST /api/download
 * Get download URLs for a specific sound
 * Body: { id: number }
 */
app.post('/api/download', async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'id parameter is required' });
    }

    const url = `${FREESOUND_API_BASE}/sounds/${id}/?token=${API_KEY}`;
    console.log(`[DOWNLOAD] Fetching info for sound ID: ${id}`);

    const data = await fetchWithRetry(url);

    // Return essential download info
    res.json({
      id: data.id,
      name: data.name,
      duration: data.duration,
      filesize: data.filesize,
      previews: data.previews,
      download: data.download,
      username: data.username,
      tags: data.tags,
      images: data.images,
    });
  } catch (error) {
    console.error('[DOWNLOAD ERROR]', error.message);
    res.status(500).json({
      error: 'Download info fetch failed',
      message: error.message,
    });
  }
});

/**
 * GET /api/sound/:id
 * Get detailed info about a specific sound
 */
app.get('/api/sound/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const url = `${FREESOUND_API_BASE}/sounds/${id}/?token=${API_KEY}`;

    console.log(`[SOUND_INFO] Fetching info for sound ID: ${id}`);

    const data = await fetchWithRetry(url);

    res.json({
      id: data.id,
      name: data.name,
      duration: data.duration,
      filesize: data.filesize,
      bitrate: data.bitrate,
      channels: data.channels,
      samplerate: data.samplerate,
      previews: data.previews,
      download: data.download,
      username: data.username,
      tags: data.tags,
      images: data.images,
      num_downloads: data.num_downloads,
      description: data.description,
    });
  } catch (error) {
    console.error('[SOUND_INFO ERROR]', error.message);
    res.status(500).json({
      error: 'Sound info fetch failed',
      message: error.message,
    });
  }
});

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    apiKeyLoaded: !!API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'premium_interface.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[ERROR]', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n✅ F.LUFS Backend Server running on http://localhost:${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
  console.log(`🌐 Frontend available at http://localhost:${PORT}`);
  console.log(`\n🔐 API Key loaded: ${API_KEY ? '✓' : '✗'}`);
  console.log(`\n💡 Tip: Use PORT=xxxx npm start to run on a different port`);
  console.log(`\nPress Ctrl+C to stop\n`);
});
