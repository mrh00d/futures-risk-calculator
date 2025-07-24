/**
 * Constants and configurations for ProfitPath calculator
 */

import type { FuturesContract, PropFirmTarget } from './types';

/**
 * Futures contracts configuration
 */
export const FUTURES_CONTRACTS: Record<string, FuturesContract> = {
  // Micro contracts
  MNQ: { 
    name: "Micro E-mini Nasdaq-100", 
    tickValue: 0.50, 
    pointValue: 2, 
    ticksPerPoint: 4, 
    defaultCommission: 1.35 
  },
  MES: { 
    name: "Micro E-mini S&P 500", 
    tickValue: 1.25, 
    pointValue: 5, 
    ticksPerPoint: 4, 
    defaultCommission: 1.35 
  },
  MYM: { 
    name: "Micro E-mini Dow", 
    tickValue: 0.50, 
    pointValue: 0.50, 
    ticksPerPoint: 1, 
    defaultCommission: 1.35 
  },
  M2K: { 
    name: "Micro E-mini Russell 2000", 
    tickValue: 0.50, 
    pointValue: 5, 
    ticksPerPoint: 10, 
    defaultCommission: 1.35 
  },
  MCL: { 
    name: "Micro Crude Oil", 
    tickValue: 1.00, 
    pointValue: 100, 
    ticksPerPoint: 100, 
    defaultCommission: 1.35 
  },
  MGC: { 
    name: "Micro Gold", 
    tickValue: 1.00, 
    pointValue: 10, 
    ticksPerPoint: 10, 
    defaultCommission: 1.35 
  },
  
  // E-mini contracts
  ES: { 
    name: "E-mini S&P 500", 
    tickValue: 12.50, 
    pointValue: 50, 
    ticksPerPoint: 4, 
    defaultCommission: 2.50 
  },
  NQ: { 
    name: "E-mini Nasdaq-100", 
    tickValue: 5.00, 
    pointValue: 20, 
    ticksPerPoint: 4, 
    defaultCommission: 2.50 
  },
  YM: { 
    name: "E-mini Dow", 
    tickValue: 5.00, 
    pointValue: 5, 
    ticksPerPoint: 1, 
    defaultCommission: 2.50 
  },
  RTY: { 
    name: "E-mini Russell 2000", 
    tickValue: 5.00, 
    pointValue: 50, 
    ticksPerPoint: 10, 
    defaultCommission: 2.50 
  },
  
  // Full-size contracts
  CL: { 
    name: "Crude Oil", 
    tickValue: 10.00, 
    pointValue: 1000, 
    ticksPerPoint: 100, 
    defaultCommission: 2.50 
  },
  GC: { 
    name: "Gold", 
    tickValue: 10.00, 
    pointValue: 100, 
    ticksPerPoint: 10, 
    defaultCommission: 2.50 
  }
};

/**
 * Prop firm profit targets
 */
export const PROP_FIRM_TARGETS: Record<string, PropFirmTarget> = {
  custom: { target: 6000 },
  
  // TopStep
  topstep_50k: { target: 3000 },
  topstep_100k: { target: 6000 },
  topstep_150k: { target: 9000 },
  
  // Elite Trader Funding
  elite_25k: { target: 1500 },
  elite_50k: { target: 2750 },
  elite_100k: { target: 6000 },
  elite_150k: { target: 9000 },
  
  // TakeProfit Trader
  takeprofit_25k: { target: 1500 },
  takeprofit_50k: { target: 3000 },
  takeprofit_100k: { target: 6000 },
  
  // My Funded Futures
  mff_25k: { target: 1250 },
  mff_50k: { target: 2500 },
  mff_100k: { target: 5000 },
  mff_150k: { target: 7500 },
  
  // BlueSky Trading
  bluesky_25k: { target: 1500 },
  bluesky_50k: { target: 3000 },
  bluesky_100k: { target: 6250 }
};

/**
 * Default values for calculator inputs
 */
export const DEFAULT_VALUES = {
  selectedContract: 'MNQ',
  selectedPropFirm: 'custom',
  winningTrades: 2,
  losingTrades: 2,
  ticksGained: 120,
  ticksLost: 68,
  numContracts: 1,
  numAccounts: 1,
  eaProfitTarget: 6000,
  tradingDaysPerMonth: 21,
  customDays: 235,
  converterTicks: 0,
  converterPoints: 0,
  
  // Target simulation defaults
  useTargetSimulation: false,
  target1Contracts: 0,
  target1Points: 10,
  target2Contracts: 0,
  target2Points: 20,
  target3Contracts: 0,
  target3Points: 40,
  
  // Breakeven simulation defaults
  useBreakevenStop: false,
  breakevenTriggerPoints: 10,
  breakevenWinRate: 0.30,
  
  // Sharing defaults
  showShareModal: false,
  shareURL: '',
  copied: false
};

/**
 * Target preset configurations
 */
export const TARGET_PRESETS = {
  conservative: {
    name: 'Conservative',
    description: '60% at 1R, 30% at 2R, 10% at 3R',
    distribution: [0.6, 0.3, 0.1],
    rMultiples: [1, 2, 3]
  },
  moderate: {
    name: 'Moderate',
    description: '40% at 1.5R, 40% at 2.5R, 20% at 4R',
    distribution: [0.4, 0.4, 0.2],
    rMultiples: [1.5, 2.5, 4]
  },
  aggressive: {
    name: 'Aggressive',
    description: '25% at 2R, 50% at 3R, 25% at 5R',
    distribution: [0.25, 0.5, 0.25],
    rMultiples: [2, 3, 5]
  },
  breakout: {
    name: 'Breakout',
    description: '33% at 3R, 33% at 5R, 34% at 8R',
    distribution: [0.33, 0.33, 0.34],
    rMultiples: [3, 5, 8]
  }
};

/**
 * Breakeven configuration constants
 */
export const BREAKEVEN_CONFIG = {
  DEFAULT_TRIGGER_POINTS: 10,
  DEFAULT_WIN_RATE: 0.30,
  TRADES_REACHING_BE_PERCENTAGE: 0.80
};

/**
 * URL parameter keys for sharing
 */
export const URL_PARAMS = {
  CONTRACT: 'c',
  PROP_FIRM: 'pf',
  WINNING_TRADES: 'w',
  LOSING_TRADES: 'l',
  TICKS_GAINED: 'tg',
  TICKS_LOST: 'tl',
  NUM_CONTRACTS: 'nc',
  NUM_ACCOUNTS: 'na',
  PROFIT_TARGET: 'pt',
  COMMISSION: 'cr',
  USE_TARGET_SIM: 'uts',
  TARGET1_CONTRACTS: 't1c',
  TARGET1_POINTS: 't1p',
  TARGET2_CONTRACTS: 't2c',
  TARGET2_POINTS: 't2p',
  TARGET3_CONTRACTS: 't3c',
  TARGET3_POINTS: 't3p',
  USE_BREAKEVEN: 'ubs',
  BREAKEVEN_TRIGGER: 'btp',
  BREAKEVEN_WIN_RATE: 'bwr'
};