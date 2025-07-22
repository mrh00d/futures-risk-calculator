# Futures Trading Risk Management Calculator

A web-based calculator for futures trading risk management with support for multiple contracts, copy trading simulation, and prop firm profit targets.

## Features
- Multiple futures contracts (MNQ, ES, NQ, etc.)
- Simple mode with fixed profit targets
- Advanced mode with multiple exit targets
- Copy trading simulation across multiple accounts
- Prop firm evaluation tracking (Topstep, Elite, Take Profit, MFF, Bluesky)
- Tick-to-point conversion
- Real-time P&L calculations
- Expectancy calculations with win rate impact

## Live Demo
Visit the live calculator at: `https://your-project.pages.dev`

## Running Locally
Simply open `index.html` in your web browser.

## Deployment with Cloudflare Pages

### Option 1: Direct Upload (Quickest)
1. Go to [Cloudflare Pages](https://pages.cloudflare.com/)
2. Click "Create a project" → "Direct Upload"
3. Name your project (e.g., "futures-risk-calculator")
4. Drag and drop this entire folder or upload a ZIP
5. Click "Deploy site"
6. Your site will be live at `https://your-project.pages.dev`

### Option 2: Git Integration (Recommended)
1. Push this repository to GitHub/GitLab
2. Go to [Cloudflare Pages](https://pages.cloudflare.com/)
3. Click "Create a project" → "Connect to Git"
4. Select your repository
5. Configure build settings:
   - Build command: (leave empty)
   - Build output directory: `/`
   - Root directory: `/`
6. Click "Save and Deploy"

### Custom Domain (Optional)
1. After deployment, go to your project settings
2. Click "Custom domains"
3. Add your domain and follow DNS instructions

## Project Structure
```
riskmanagement/
├── index.html          # Main application
├── calculator.js       # Calculator logic
├── styles.css         # Custom styles
├── _headers           # Security headers for Cloudflare Pages
├── _redirects         # Redirect rules (if needed)
└── tests/             # Playwright tests
```

## Security
The `_headers` file includes security headers automatically applied by Cloudflare Pages:
- Content Security Policy
- X-Frame-Options
- X-Content-Type-Options
- Referrer Policy
- Permissions Policy

## Running Tests

First install dependencies:
```bash
npm install
```

Then run the Playwright tests:
```bash
npm test
```

For UI mode (recommended for debugging):
```bash
npm run test:ui
```

For headed mode (see browser):
```bash
npm run test:headed
```

## Test Coverage
The tests verify:
- Basic R:R calculations
- P&L calculations with commissions
- Multi-account scaling
- Prop firm target calculations
- Target simulation mode
- Contract-specific tick/point conversions
- Expectancy calculations with win rate impact

## License
MIT