# Cloudflare Workers Deployment Instructions

## Prerequisites
1. Install Wrangler CLI:
   ```bash
   npm install -g wrangler
   ```

2. Login to Cloudflare:
   ```bash
   wrangler login
   ```

## Deploy Your Calculator

1. **First-time setup:**
   ```bash
   # This will create the worker and KV namespace
   wrangler deploy
   ```

2. **View your site:**
   - After deployment, you'll get a URL like: `https://futures-risk-calculator.YOUR-SUBDOMAIN.workers.dev`

3. **Make updates:**
   ```bash
   # After making changes, just run:
   wrangler deploy
   ```

## Custom Domain (Optional)

1. Update `wrangler.toml`:
   ```toml
   routes = [
     { pattern = "calculator.yourdomain.com", custom_domain = true }
   ]
   ```

2. Add the domain in Cloudflare dashboard:
   - Go to Workers & Pages
   - Select your worker
   - Go to Settings → Domains & Routes
   - Add your custom domain

## Local Development

```bash
# Run locally at http://localhost:8787
wrangler dev
```

## File Structure for Workers
```
riskmanagement/
├── worker.js          # Worker script
├── wrangler.toml      # Config file
├── public/            # All static files
│   ├── index.html
│   ├── calculator.js
│   ├── styles.css
│   ├── _headers
│   └── _redirects
└── tests/            # Tests (not deployed)
```