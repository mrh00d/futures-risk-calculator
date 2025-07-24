import type { FuturesContract, PropFirmTarget } from './types';
export declare const FUTURES_CONTRACTS: Record<string, FuturesContract>;
export declare const PROP_FIRM_TARGETS: Record<string, PropFirmTarget>;
export declare const DEFAULT_VALUES: {
    selectedContract: string;
    selectedPropFirm: string;
    winningTrades: number;
    losingTrades: number;
    ticksGained: number;
    ticksLost: number;
    numContracts: number;
    numAccounts: number;
    eaProfitTarget: number;
    tradingDaysPerMonth: number;
    customDays: number;
    converterTicks: number;
    converterPoints: number;
    useTargetSimulation: boolean;
    target1Contracts: number;
    target1Points: number;
    target2Contracts: number;
    target2Points: number;
    target3Contracts: number;
    target3Points: number;
    useBreakevenStop: boolean;
    breakevenTriggerPoints: number;
    breakevenWinRate: number;
    showShareModal: boolean;
    shareURL: string;
    copied: boolean;
};
export declare const TARGET_PRESETS: {
    conservative: {
        name: string;
        description: string;
        distribution: number[];
        rMultiples: number[];
    };
    moderate: {
        name: string;
        description: string;
        distribution: number[];
        rMultiples: number[];
    };
    aggressive: {
        name: string;
        description: string;
        distribution: number[];
        rMultiples: number[];
    };
    breakout: {
        name: string;
        description: string;
        distribution: number[];
        rMultiples: number[];
    };
};
export declare const BREAKEVEN_CONFIG: {
    DEFAULT_TRIGGER_POINTS: number;
    DEFAULT_WIN_RATE: number;
    TRADES_REACHING_BE_PERCENTAGE: number;
};
export declare const URL_PARAMS: {
    CONTRACT: string;
    PROP_FIRM: string;
    WINNING_TRADES: string;
    LOSING_TRADES: string;
    TICKS_GAINED: string;
    TICKS_LOST: string;
    NUM_CONTRACTS: string;
    NUM_ACCOUNTS: string;
    PROFIT_TARGET: string;
    COMMISSION: string;
    USE_TARGET_SIM: string;
    TARGET1_CONTRACTS: string;
    TARGET1_POINTS: string;
    TARGET2_CONTRACTS: string;
    TARGET2_POINTS: string;
    TARGET3_CONTRACTS: string;
    TARGET3_POINTS: string;
    USE_BREAKEVEN: string;
    BREAKEVEN_TRIGGER: string;
    BREAKEVEN_WIN_RATE: string;
};
//# sourceMappingURL=constants.d.ts.map