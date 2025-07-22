# Futures Trading Risk Management Calculator

## Project Overview
A single-page HTML application using Alpine.js and Tailwind CSS to calculate risk management metrics for futures trading. The calculator allows users to select different futures contracts and input their trading statistics to see profitability projections.

## Features

### 1. Futures Contract Selection
- Dropdown to select different futures contracts (MNQ, ES, NQ, YM, RTY, CL, GC, etc.)
- Each contract has predefined tick values and point values
- Contracts data includes:
  - Symbol
  - Name
  - Tick size
  - Tick value
  - Point value
  - Commission per round trip

### 2. Input Fields
- Account information
- Trade statistics:
  - Number of winning trades
  - Number of losing trades
  - Ticks gained per winning trade
  - Ticks lost per losing trade
  - Number of contracts traded
- Commission per round trip
- Number of accounts
- EA profit target
- Trading days per month

### 3. Calculations
- Win/Loss percentage
- R ratio (Risk:Reward ratio)
- Average loss/gain per trade
- Daily P&L (gross and net after commissions)
- Weekly P&L projections
- Monthly P&L projections
- Yearly/custom period projections
- Days to reach EA profit target

### 4. Display Sections
- Header stats (account info, daily/weekly/monthly P&L)
- Trade count and statistics
- Risk:Reward analysis table
- Daily/weekly/monthly gain projections
- Custom period calculations
- EA profit target tracking

## Technical Implementation

### Technologies
- HTML5
- Alpine.js for reactive data and calculations
- Tailwind CSS for styling
- No build process required - runs directly in browser

### Data Structure
```javascript
{
  // Futures contracts data
  contracts: {
    MNQ: { name: "Micro E-mini Nasdaq-100", tickValue: 0.50, pointValue: 2, defaultCommission: 1.35 },
    ES: { name: "E-mini S&P 500", tickValue: 12.50, pointValue: 50, defaultCommission: 2.50 },
    // ... more contracts
  },
  
  // User inputs
  selectedContract: 'MNQ',
  winningTrades: 2,
  losingTrades: 2,
  ticksGained: 120,
  ticksLost: 68,
  numContracts: 1,
  commissionPerRT: 1.35,
  numAccounts: 1,
  eaProfitTarget: 6000,
  tradingDaysPerMonth: 21,
  customDays: 235,
  
  // Calculated values (computed properties)
  totalTrades,
  winLossPercent,
  rRatio,
  grossDailyGain,
  totalCommissions,
  netDailyGain,
  weeklyGain,
  monthlyGain,
  customPeriodGain,
  daysToEATarget
}
```

## UI Layout
- Clean, professional design similar to the original
- Top Gun Trading branding
- Color coding: Green for profits, red for losses
- Responsive layout that works on desktop and mobile
- Clear sections for different calculation areas

## File Structure
- `index.html` - Single file containing all HTML, CSS, and JavaScript
- Uses CDN links for Alpine.js and Tailwind CSS
- Self-contained, no external dependencies needed

## Future Enhancements (not in initial version)
- Save/load scenarios
- Print-friendly version
- Export to PDF/CSV
- Multiple account management
- Historical data integration