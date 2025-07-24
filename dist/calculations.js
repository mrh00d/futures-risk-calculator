/**
 * Financial calculation utilities for futures trading
 */
/**
 * Calculate the dollar value of ticks for a given contract
 */
export function calculateTickValue(ticks, contract, numContracts) {
    return ticks * contract.tickValue * numContracts;
}
/**
 * Convert points to ticks for a specific contract
 */
export function pointsToTicks(points, contract) {
    return points * contract.ticksPerPoint;
}
/**
 * Convert ticks to points for a specific contract
 */
export function ticksToPoints(ticks, contract) {
    return ticks / contract.ticksPerPoint;
}
/**
 * Calculate expectancy based on win rate and average win/loss amounts
 */
export function calculateExpectancy(winRate, avgWinAmount, avgLossAmount, commissionPerRT, numContracts) {
    const winAmount = avgWinAmount - (commissionPerRT * numContracts);
    const lossAmount = avgLossAmount + (commissionPerRT * numContracts);
    const lossRate = 1 - winRate;
    return (winRate * winAmount) - (lossRate * lossAmount);
}
/**
 * Calculate R-value (Risk/Reward ratio)
 */
export function calculateRValue(avgWinTicks, avgLossTicks) {
    return avgLossTicks > 0 ? avgWinTicks / avgLossTicks : 0;
}
/**
 * Calculate breakeven-adjusted win rate
 */
export function calculateBreakevenAdjustedWinRate(baseWinRate, breakevenWinRate, percentReachingBE = 0.8) {
    const tradesReachingBE = baseWinRate * percentReachingBE;
    const tradesNotReachingBE = baseWinRate * (1 - percentReachingBE);
    return tradesNotReachingBE + (tradesReachingBE * breakevenWinRate);
}
/**
 * Calculate weighted average exit points for multi-target strategies
 */
export function calculateWeightedAverageExit(targets, totalContracts) {
    if (totalContracts === 0)
        return 0;
    let totalPoints = 0;
    let contractsUsed = 0;
    for (const target of targets) {
        if (contractsUsed >= totalContracts)
            break;
        const contracts = Math.min(target.contracts, totalContracts - contractsUsed);
        totalPoints += contracts * target.points;
        contractsUsed += contracts;
    }
    return contractsUsed > 0 ? totalPoints / contractsUsed : 0;
}
/**
 * Calculate days to reach profit target
 */
export function calculateDaysToTarget(targetAmount, dailyProfit) {
    return dailyProfit > 0 ? targetAmount / dailyProfit : 0;
}
/**
 * Format currency values
 */
export function formatCurrency(amount) {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    return formatter.format(amount);
}
/**
 * Format percentage values
 */
export function formatPercentage(value, decimals = 1) {
    return `${value.toFixed(decimals)}%`;
}
export function validateTradingInputs(inputs) {
    const errors = [];
    if (inputs.winningTrades < 0) {
        errors.push('Winning trades must be non-negative');
    }
    if (inputs.losingTrades < 0) {
        errors.push('Losing trades must be non-negative');
    }
    if (inputs.winningTrades + inputs.losingTrades === 0) {
        errors.push('Total trades must be greater than zero');
    }
    if (inputs.ticksGained < 0) {
        errors.push('Ticks gained must be non-negative');
    }
    if (inputs.ticksLost < 0) {
        errors.push('Ticks lost must be non-negative');
    }
    if (inputs.numContracts <= 0) {
        errors.push('Number of contracts must be greater than zero');
    }
    if (inputs.numAccounts <= 0) {
        errors.push('Number of accounts must be greater than zero');
    }
    return {
        isValid: errors.length === 0,
        errors
    };
}
