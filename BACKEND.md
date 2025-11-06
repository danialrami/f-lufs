# F.LUFS Backend Setup

## Overview

The backend is a secure API gateway that:
- Keeps your Freesound API key hidden (stored in `.env` only)
- Proxies requests to Freesound's API
- Serves the frontend HTML
- Implements rate limiting and retry logic

## Setup

### 1. Install Dependencies

```bash
npm install
```

This adds:
- `express` - Web server framework
- `cors` - Cross-origin requests
- `node-fetch` - HTTP requests
- `dotenv` - Environment variable loading

### 2. Ensure `.env` File Exists

Your `.env` file should contain:

```env
FREESOUND_CLIENT_SECRET_API_KEY=your_api_key_here
REQUEST_TIMEOUT_MS=5000
MAX_RETRIES=3
NODE_ENV=development
```

The `.env` file is in `.gitignore` and will NOT be committed to version control.

### 3. Start the Server

**Local development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Server will run on `http://localhost:3000` (or `$PORT` environment variable)

## API Endpoints

### Health Check
```
GET /api/health
```
Returns status and whether API key is loaded.

### Search Sounds
```
POST /api/search
Content-Type: application/json

{
  "search": ["drum", "bass"],
  "duration": [0, 15]
}
```

Returns array of sounds matching query and duration range.

### Get Sound Details
```
GET /api/sound/:id
```

Returns detailed info about a specific sound.

### Download Info
```
POST /api/download
Content-Type: application/json

{
  "id": 12345
}
```

Returns download URLs and metadata for a sound.

## Frontend

The frontend (`premium_interface.html`) automatically calls these backend endpoints instead of making direct API requests.

### Key Changes

1. **Search** → Calls `POST /api/search`
2. **Audio Loading** → Uses preview URL from API response
3. **Download** → Frontend converts audio buffer to WAV (browser-side)

## Deployment

### Cloudflare Tunnel (for demos)

1. Install Cloudflare CLI: https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/
2. Run tunnel:
   ```bash
   cloudflare-warp tunnel run
   ```
3. Share the public URL with your professor

### Hostinger VPS

1. SSH into your server
2. Clone repository
3. Create `.env` file with API key
4. Run `npm install && npm start`
5. Set up reverse proxy (nginx) to forward traffic to port 3000

Example nginx config:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Security

✅ **API key is secure because:**
- Stored in `.env` (git-ignored)
- Only loaded on server-side
- Never exposed to browser/frontend
- Frontend can't access `.env`

✅ **CORS enabled** - Frontend on same origin can communicate with backend

## Troubleshooting

**"API Key not loaded"**
- Check `.env` file exists in project root
- Verify `FREESOUND_CLIENT_SECRET_API_KEY` is set correctly

**"Port 3000 already in use"**
- Use different port: `PORT=3001 npm start`
- Or kill existing process

**"Search returns no results"**
- Check search terms and duration range
- Verify Freesound API key is valid
- Check browser console for error messages

## Development Tips

- Frontend changes don't require restart
- Backend changes require restart
- Check server logs for API request details
- Use `/api/health` endpoint to verify server is running
