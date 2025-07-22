# Cloudflare Deployment Guide

## You have TWO options:

### Option 1: Cloudflare Pages (RECOMMENDED for static sites)
This is what you should use for this calculator:

1. Go to https://dash.cloudflare.com
2. Click "Workers & Pages" in sidebar
3. Click "Create application"
4. Select "Pages" tab (NOT Workers)
5. Choose "Direct Upload"
6. Upload your project folder
7. Done!

### Option 2: Cloudflare Workers (More complex)
Only use this if you need server-side logic:

1. Install wrangler locally:
   ```bash
   npm install -g wrangler
   wrangler login
   wrangler deploy
   ```

## What's the difference?

**Pages**: 
- For static websites (HTML, CSS, JS)
- Automatic deployment
- No server code needed
- FREE and simple

**Workers**:
- For dynamic applications
- Requires JavaScript server code
- More complex setup
- For APIs and server logic

## Your calculator is static, so use PAGES!

The error you're seeing is likely because:
1. Workers expects server-side JavaScript code
2. Your project is just static HTML/CSS/JS files
3. The dashboard is trying to run it as a Worker instead of serving static files

## Quick Fix:
1. Cancel the Worker setup
2. Go back to dashboard
3. Create a new "Pages" project instead
4. Upload your files
5. It will work immediately!