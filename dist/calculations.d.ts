import type { FuturesContract } from './types';
export declare function calculateTickValue(ticks: number, contract: FuturesContract, numContracts: number): number;
export declare function pointsToTicks(points: number, contract: FuturesContract): number;
export declare function ticksToPoints(ticks: number, contract: FuturesContract): number;
export declare function calculateExpectancy(winRate: number, avgWinAmount: number, avgLossAmount: number, commissionPerRT: number, numContracts: number): number;
export declare function calculateRValue(avgWinTicks: number, avgLossTicks: number): number;
export declare function calculateBreakevenAdjustedWinRate(baseWinRate: number, breakevenWinRate: number, percentReachingBE?: number): number;
export declare function calculateWeightedAverageExit(targets: Array<{
    contracts: number;
    points: number;
}>, totalContracts: number): number;
export declare function calculateDaysToTarget(targetAmount: number, dailyProfit: number): number;
export declare function formatCurrency(amount: number): string;
export declare function formatPercentage(value: number, decimals?: number): string;
export interface ValidationResult {
    isValid: boolean;
    errors: string[];
}
export declare function validateTradingInputs(inputs: {
    winningTrades: number;
    losingTrades: number;
    ticksGained: number;
    ticksLost: number;
    numContracts: number;
    numAccounts: number;
}): ValidationResult;
//# sourceMappingURL=calculations.d.ts.map