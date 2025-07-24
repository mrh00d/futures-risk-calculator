export interface FuturesContract {
    name: string;
    tickValue: number;
    pointValue: number;
    ticksPerPoint: number;
    defaultCommission: number;
}
export interface PropFirmTarget {
    target: number;
}
export interface TargetSimulation {
    useTargetSimulation: boolean;
    target1Contracts: number;
    target1Points: number;
    target2Contracts: number;
    target2Points: number;
    target3Contracts: number;
    target3Points: number;
}
export interface BreakevenSimulation {
    useBreakevenStop: boolean;
    breakevenTriggerPoints: number;
    breakevenWinRate: number;
}
export interface TradingMetrics {
    winningTrades: number;
    losingTrades: number;
    ticksGained: number;
    ticksLost: number;
    numContracts: number;
    numAccounts: number;
    commissionPerRT: number;
}
export interface CalculatorConfig {
    selectedContract: string;
    selectedPropFirm: string;
    eaProfitTarget: number;
    tradingDaysPerMonth: number;
    customDays: number;
    converterTicks: number;
    converterPoints: number;
}
export interface ShareState {
    showShareModal: boolean;
    shareURL: string;
    copied: boolean;
}
export interface CalculatorState extends TradingMetrics, CalculatorConfig, TargetSimulation, BreakevenSimulation, ShareState {
}
export interface CalculatedMetrics {
    totalTrades: number;
    winLossPercent: number;
    winRate: number;
    avgWinAmount: number;
    avgLossAmount: number;
    maxTradeLoss: number;
    rValue: number;
    rRatio: string;
    expectancy: number;
    expectancyR: number;
    expectancyPercent: number;
    grossDailyGain: number;
    netDailyGain: number;
    totalCommissions: number;
    grossDailyGainTotal: number;
    netDailyGainTotal: number;
    daysToEATarget: number;
    daysToEATargetAllAccounts: number;
}
export interface BreakevenCalculatedMetrics {
    breakevenAdjustedWinRate: number;
    breakevenScratchRate: number;
    breakevenAdjustedExpectancy: number;
}
export interface TargetCalculatedMetrics {
    totalTargetContracts: number;
    avgExitPoints: number;
    avgExitTicks: number;
    blendedRR: number;
}
export type TargetPresetStyle = 'conservative' | 'moderate' | 'aggressive' | 'breakout';
export interface RiskCalculatorComponent extends CalculatorState, CalculatedMetrics, BreakevenCalculatedMetrics, TargetCalculatedMetrics {
    contracts: Record<string, FuturesContract>;
    propFirmTargets: Record<string, PropFirmTarget>;
    contract: FuturesContract;
    init(): void;
    updatePropFirmTarget(): void;
    setupTargets(style: TargetPresetStyle): void;
    calculatePeriodGain(days: number): number;
    loadFromURL(): void;
    generateShareURL(): void;
    shareCalculation(): void;
    copyShareURL(): void;
    clearTargetContracts(): void;
}
export type AlpineComponent<T> = T & {
    $el: HTMLElement;
    $refs: Record<string, HTMLElement>;
    $watch<K extends keyof T>(property: K, callback: (value: T[K], oldValue: T[K]) => void): void;
};
//# sourceMappingURL=types.d.ts.map