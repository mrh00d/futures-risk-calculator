// Futures contract definition
export interface FuturesContract {
  name: string;
  tickValue: number;
  pointValue: number;
  ticksPerPoint: number;
  defaultCommission: number;
}

export type ContractSymbol = 'MNQ' | 'ES' | 'MES' | 'NQ' | 'YM' | 'MYM' | 'RTY' | 'M2K' | 'CL' | 'MCL' | 'GC' | 'MGC';

export type Contracts = Record<ContractSymbol, FuturesContract>;

// Prop firm configuration
export interface PropFirmTarget {
  target: number;
  dailyLimit: number;
  maxDrawdown: number;
}

export type PropFirmType = 
  | 'custom'
  | 'topstep_50k' | 'topstep_100k' | 'topstep_150k'
  | 'elite_25k' | 'elite_50k' | 'elite_100k' | 'elite_150k'
  | 'takeprofit_25k' | 'takeprofit_50k' | 'takeprofit_100k'
  | 'mff_25k' | 'mff_50k' | 'mff_100k' | 'mff_150k'
  | 'bluesky_25k' | 'bluesky_50k' | 'bluesky_100k';

export type PropFirmTargets = Record<PropFirmType, PropFirmTarget>;

// Trade parameters
export interface TradeParameters {
  selectedContract: ContractSymbol;
  winningTrades: number;
  losingTrades: number;
  ticksGained: number;
  ticksLost: number;
  numContracts: number;
  numAccounts: number;
  commissionPerRT: number;
  tradingDaysPerMonth: number;
  customDays: number;
}

// Target simulation parameters
export interface TargetSimulation {
  useTargetSimulation: boolean;
  target1Contracts: number;
  target1Points: number;
  target2Contracts: number;
  target2Points: number;
  target3Contracts: number;
  target3Points: number;
}

// Breakeven simulation parameters
export interface BreakevenSimulation {
  useBreakevenStop: boolean;
  breakevenTriggerPoints: number;
  breakevenWinRate: number;
}

// Prop firm settings
export interface PropFirmSettings {
  selectedPropFirm: PropFirmType;
  eaProfitTarget: number;
  eaDailyLimit: number;
  eaMaxDrawdown: number;
}

// UI state
export interface UIState {
  showShareModal: boolean;
  shareURL: string;
  copied: boolean;
  converterTicks: number;
  converterPoints: number;
  showDetailedView: boolean;
}

// Calculated results
export interface CalculatedResults {
  totalTrades: number;
  winLossPercent: number;
  winRate: number;
  avgWinAmount: number;
  avgLossAmount: number;
  expectancy: number;
  expectancyR: number;
  expectancyPercent: number;
  grossDailyGain: number;
  totalCommissions: number;
  netDailyGain: number;
  netDailyGainTotal: number;
  grossDailyGainTotal: number;
  daysToEATarget: number;
  daysToEATargetAllAccounts: number;
  maxTradeLoss: number;
  rRatio: string;
  rValue: number;
  maxTradeGain: number;
}

// Target calculation results
export interface TargetCalculationResults {
  totalTargetContracts: number;
  avgExitPoints: number;
  avgExitTicks: number;
  blendedRR: number;
}

// Breakeven calculation results
export interface BreakevenCalculationResults {
  breakevenAdjustedWinRate: number;
  breakevenScratchRate: number;
  breakevenAdjustedExpectancy: number;
}

// Main calculator state
export interface CalculatorState extends 
  TradeParameters, 
  TargetSimulation, 
  BreakevenSimulation, 
  PropFirmSettings, 
  UIState {
  contracts: Contracts;
  propFirmTargets: PropFirmTargets;
}

// Alpine.js component interface
export interface RiskCalculatorComponent extends CalculatorState {
  // Computed properties (getters)
  readonly contract: FuturesContract;
  readonly totalTrades: number;
  readonly winLossPercent: number;
  readonly winRate: number;
  readonly avgWinAmount: number;
  readonly avgLossAmount: number;
  readonly expectancy: number;
  readonly expectancyR: number;
  readonly expectancyPercent: number;
  readonly grossDailyGain: number;
  readonly totalCommissions: number;
  readonly netDailyGain: number;
  readonly netDailyGainTotal: number;
  readonly grossDailyGainTotal: number;
  readonly daysToEATarget: number;
  readonly daysToEATargetAllAccounts: number;
  readonly maxTradeLoss: number;
  readonly rRatio: string;
  readonly rValue: number;
  readonly maxTradeGain: number;
  readonly totalTargetContracts: number;
  readonly avgExitPoints: number;
  readonly avgExitTicks: number;
  readonly blendedRR: number;
  readonly breakevenAdjustedWinRate: number;
  readonly breakevenScratchRate: number;
  readonly breakevenAdjustedExpectancy: number;
  readonly maxConsecutiveLosses: number;
  readonly maxDrawdownFromLosses: number;
  readonly tradesToDailyLimit: number;
  readonly daysToBlowAccount: number;
  readonly riskOfRuin: number;
  readonly recommendedMaxContracts: number;
  readonly isOversized: boolean;
  
  // Methods
  init(): void;
  updatePropFirmTarget(): void;
  setupTargets(style: 'conservative' | 'moderate' | 'aggressive'): void;
  shareAsURL(): void;
  copyShareURL(): Promise<void>;
  loadFromURL(): void;
  saveAsImage(): Promise<void>;
  calculateBreakevenReachRate(): number;
}