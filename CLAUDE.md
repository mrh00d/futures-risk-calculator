# Futures Trading Risk Management Calculator

## Project Overview
A comprehensive web-based futures trading risk management calculator built with Alpine.js and Tailwind CSS. The application helps traders calculate risk/reward ratios, profit projections, and simulate multiple trading scenarios across various futures contracts.

## Architecture

### File Structure
```
/
├── index.html          # Main application file
├── calculator.js       # Alpine.js component logic
├── styles.css         # Custom styles and dark mode enhancements
├── dist/
│   └── output.css     # Built Tailwind CSS (generated)
├── src/
│   └── input.css      # Tailwind source file
├── package.json       # Dependencies and build scripts
├── tailwind.config.js # Tailwind configuration
├── postcss.config.js  # PostCSS configuration
├── _headers          # Cloudflare Pages headers for caching
└── tests/
    └── risk-calculator.spec.js  # Playwright tests
```

### Technologies
- **Alpine.js 3.x** - Reactive UI framework
- **Tailwind CSS 3.x** - Utility-first CSS framework with dark mode
- **html2canvas** - Client-side screenshot generation
- **Playwright** - End-to-end testing
- **Cloudflare Pages** - Deployment platform

### Build Process
```bash
# Install dependencies
npm install

# Build CSS for production
npm run build

# Run tests
npm test
```

## Features

### 1. Futures Contract Support
Comprehensive support for major futures contracts:
- **Micro contracts**: MNQ, MES, MYM, M2K, MCL, MGC
- **E-mini contracts**: ES, NQ, YM, RTY
- **Commodities**: CL (Crude Oil), GC (Gold)

Each contract includes:
- Tick value and point value
- Ticks per point conversion
- Default commission rates

### 2. Risk Management Features

#### Basic Risk/Reward Analysis
- Stop loss and profit target configuration
- Real-time R:R ratio calculation
- Commission impact on profitability
- Win rate and expectancy calculations

#### Advanced Profit Target Simulation
- Multiple exit levels (up to 3 targets)
- Contract distribution across targets
- Weighted average exit calculation
- Effective R:R based on partial exits
- Preset strategies (Conservative, Moderate, Aggressive)

#### Copy Trading Simulation
- Simulate trading across multiple accounts (1-20)
- Aggregate P&L calculations
- Account scaling visualization

### 3. Prop Firm Integration
Pre-configured evaluation targets for:
- **Topstep**: $50K Express, $100K, $150K
- **Elite Trader Funding**: $25K, $50K, $100K, $150K
- **Take Profit Trader**: $25K, $50K, $100K
- **My Funded Futures**: $25K, $50K, $100K, $150K
- **Bluesky**: $25K, $50K, $100K

### 4. User Experience Features

#### Dark Mode
- System preference detection
- Manual toggle with persistence
- Optimized contrast and readability
- Full theme support in saved images

#### Share & Save
- URL-based configuration sharing
- Image export with html2canvas
- All settings preserved in share links
- Dark mode respected in exports

#### Real-time Calculations
- Tick/Point converter
- Expectancy calculator
- Daily/Weekly/Monthly/Yearly projections
- Custom period projections
- Progress tracking to profit targets

## Data Model

```javascript
{
  // Contract selection
  selectedContract: 'MNQ',
  contracts: { /* contract definitions */ },
  
  // Trade parameters
  winningTrades: 2,
  losingTrades: 2,
  ticksGained: 120,
  ticksLost: 68,
  numContracts: 1,
  commissionPerRT: 1.35,
  
  // Account management
  numAccounts: 1,
  selectedPropFirm: 'custom',
  eaProfitTarget: 6000,
  
  // Profit target simulation
  useTargetSimulation: false,
  target1Contracts: 0,
  target1Points: 10,
  target2Contracts: 0,
  target2Points: 20,
  target3Contracts: 0,
  target3Points: 40,
  
  // UI state
  showShareModal: false,
  shareURL: '',
  copied: false,
  
  // Settings
  tradingDaysPerMonth: 21,
  customDays: 235,
  converterTicks: 0,
  converterPoints: 0
}
```

## Key Calculations

### Expectancy
```javascript
expectancy = (winRate * avgWinAmount) - ((1 - winRate) * avgLossAmount)
```

### Risk:Reward Ratio
- Simple mode: `ticksGained / ticksLost`
- Advanced mode: Weighted average based on partial exits

### Profit Projections
- Accounts for commissions on both sides
- Scales across multiple accounts
- Factors in win rate for realistic projections

## Testing

First install Playwright browsers:
```bash
npx playwright install
```

Then run comprehensive tests with:
```bash
npm test
```

Tests cover:
- Basic calculations
- R:R ratios with different scenarios
- Expectancy calculations
- Multi-account simulations
- Profit target simulations
- URL parameter encoding/decoding
- Dark mode toggle and persistence
- Share modal functionality
- Image export capabilities

## Deployment

Deployed on Cloudflare Pages with:
- Automatic builds on push
- No-cache headers for always-fresh content
- Security headers (CSP, X-Frame-Options, etc.)
- Global CDN distribution

## Performance Optimizations

1. **Tailwind Production Build**
   - Purged unused styles
   - Minified CSS output
   - ~180ms build time

2. **Caching Strategy**
   - No-cache headers ensure fresh content
   - CDN resources cached by browser
   - No service workers (removed for simplicity)

3. **Alpine.js Optimizations**
   - Computed properties for derived values
   - Minimal DOM updates
   - Efficient data binding

## Security Considerations

- CSP headers prevent XSS attacks
- No external data connections
- All calculations client-side
- URL parameters sanitized
- No sensitive data storage

## Browser Support

- Modern browsers with ES6 support
- Chrome, Firefox, Safari, Edge
- Mobile responsive design
- Dark mode requires CSS custom properties support

## Known Limitations

1. No data persistence (by design)
2. Image export depends on html2canvas capabilities
3. Share URLs can become long with many parameters
4. Maximum 20 accounts in simulation

## Future Enhancements

- [ ] Historical trade import
- [ ] Advanced statistics (Sharpe, Sortino)
- [ ] Trade journal integration
- [ ] API for prop firm data
- [ ] Mobile app version

## Maintenance Notes

When updating:
1. Run `npm run build` for CSS changes
2. Test dark mode thoroughly
3. Verify share URL functionality
4. Run full test suite
5. Clear Cloudflare cache if needed

## Commands Reference

```bash
# Development
npm run dev          # Watch CSS changes

# Building
npm run build        # Production build
npm run build:css    # Just build CSS

# Testing
npm test            # Run all tests
npm run test:headed # Run tests with browser UI

# Deployment
git push            # Auto-deploys to Cloudflare Pages
```