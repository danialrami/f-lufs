# F.LUFS Deployment & Demo Guide

## What Changed

Your F.LUFS frontend now has a **secure backend gateway** that:
- ✅ Hides your Freesound API key from browser inspection
- ✅ Handles all API communication server-side
- ✅ Implements retry logic and error handling
- ✅ Is ready for production deployment

## Quick Start (Local Demo)

```bash
# Install dependencies (done ✓)
npm install

# Start the server
npm run dev

# Open browser to http://localhost:8080
```

That's it! Your frontend will now call the backend instead of exposing your API key.

## Demo with Cloudflare Tunnel

Perfect for showing your professor without uploading anywhere:

### 1. Install Cloudflare CLI
Download from: https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/

### 2. Start your backend
```bash
npm run dev
```

### 3. In another terminal, start Cloudflare tunnel
```bash
cloudflare tunnel run
```

### 4. Share the public URL with your professor
```
https://your-tunnel.trycloudflare.com
```

He can now visit this URL and inspect the frontend code - **no API key visible!** ✨

## Production Deployment (Hostinger)

### 1. SSH into your Hostinger VPS
```bash
ssh user@your-vps-ip
```

### 2. Clone the repository
```bash
git clone https://github.com/danialrami/f-lufs.git
cd f-lufs
```

### 3. Create `.env` file with your credentials
```bash
nano .env
```

Paste:
```env
FREESOUND_CLIENT_SECRET_API_KEY=4YST5apu7d956qSx6Zdf7NmZV7yrP9b5XMelqMdd
LIBRARY_PATH=/path/to/samples
CONFIG_PATH=~/.flufs
NODE_ENV=production
REQUEST_TIMEOUT_MS=5000
MAX_RETRIES=3
```

### 4. Install dependencies
```bash
npm install --production
```

### 5. Start the server (using PM2 for auto-restart)
```bash
npm install -g pm2
pm2 start backend/server.js --name "flufs"
pm2 startup
pm2 save
```

### 6. Set up nginx reverse proxy

Create `/etc/nginx/sites-available/f-lufs`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable it:
```bash
sudo ln -s /etc/nginx/sites-available/f-lufs /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 7. Set up SSL (HTTPS)
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Architecture

```
┌─────────────────────────────────────────────────────┐
│ Visitor's Browser                                   │
│  - Sees clean HTML/JS frontend                      │
│  - Makes requests to /api/* endpoints               │
│  - NO API key visible in DevTools                   │
└──────────────────┬──────────────────────────────────┘
                   │ HTTP/HTTPS
                   ▼
┌─────────────────────────────────────────────────────┐
│ Your F.LUFS Backend (Node.js/Express)               │
│  - Reads FREESOUND_CLIENT_SECRET_API_KEY from .env  │
│  - Validates requests                               │
│  - Proxies to Freesound API                         │
│  - Returns results to frontend                      │
└──────────────────┬──────────────────────────────────┘
                   │ HTTPS
                   ▼
┌─────────────────────────────────────────────────────┐
│ Freesound API                                       │
│  - Authenticated with your API key                  │
│  - Returns sound data                               │
└─────────────────────────────────────────────────────┘
```

## Security Checklist

Before sharing your demo:

- ✅ API key is in `.env` (git-ignored)
- ✅ `.env` is NOT committed to git
- ✅ Frontend code has NO hardcoded API key
- ✅ Backend runs locally or on your server
- ✅ CORS is configured (won't allow external sites to use your API)

## Troubleshooting

### "Cannot find module 'express'"
```bash
npm install
```

### "Port 8080 in use"
```bash
PORT=9000 npm run dev
```

### "API key not found"
- Verify `.env` exists in project root
- Verify `FREESOUND_CLIENT_SECRET_API_KEY` is set

### "Search returns nothing"
- Check browser console for error messages
- Make sure Freesound API key is valid
- Try different search terms

## Next Steps

1. **Demo with professor** - Use Cloudflare Tunnel (no setup needed)
2. **Deploy to Hostinger** - Follow production steps above
3. **Custom domain** - Point your domain to Hostinger VPS
4. **SSL certificate** - Use Certbot for free HTTPS

Questions? Check `BACKEND.md` for detailed API documentation.
