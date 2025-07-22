// Futures Trading Risk Management Calculator
function riskCalculator() {
    return {
        // Futures contracts data with ticks per point
        contracts: {
            MNQ: { name: "Micro E-mini Nasdaq-100", tickValue: 0.50, pointValue: 2, ticksPerPoint: 4, defaultCommission: 1.35 },
            ES: { name: "E-mini S&P 500", tickValue: 12.50, pointValue: 50, ticksPerPoint: 4, defaultCommission: 2.50 },
            MES: { name: "Micro E-mini S&P 500", tickValue: 1.25, pointValue: 5, ticksPerPoint: 4, defaultCommission: 1.35 },
            NQ: { name: "E-mini Nasdaq-100", tickValue: 5.00, pointValue: 20, ticksPerPoint: 4, defaultCommission: 2.50 },
            YM: { name: "E-mini Dow", tickValue: 5.00, pointValue: 5, ticksPerPoint: 1, defaultCommission: 2.50 },
            MYM: { name: "Micro E-mini Dow", tickValue: 0.50, pointValue: 0.50, ticksPerPoint: 1, defaultCommission: 1.35 },
            RTY: { name: "E-mini Russell 2000", tickValue: 5.00, pointValue: 50, ticksPerPoint: 10, defaultCommission: 2.50 },
            M2K: { name: "Micro E-mini Russell 2000", tickValue: 0.50, pointValue: 5, ticksPerPoint: 10, defaultCommission: 1.35 },
            CL: { name: "Crude Oil", tickValue: 10.00, pointValue: 1000, ticksPerPoint: 100, defaultCommission: 2.50 },
            MCL: { name: "Micro Crude Oil", tickValue: 1.00, pointValue: 100, ticksPerPoint: 100, defaultCommission: 1.35 },
            GC: { name: "Gold", tickValue: 10.00, pointValue: 100, ticksPerPoint: 10, defaultCommission: 2.50 },
            MGC: { name: "Micro Gold", tickValue: 1.00, pointValue: 10, ticksPerPoint: 10, defaultCommission: 1.35 }
        },
        
        // Prop firm presets
        propFirmTargets: {
            custom: { target: 6000 },
            topstep_50k: { target: 3000 },
            topstep_100k: { target: 6000 },
            topstep_150k: { target: 9000 },
            elite_25k: { target: 1500 },
            elite_50k: { target: 2750 },
            elite_100k: { target: 6000 },
            elite_150k: { target: 9000 },
            takeprofit_25k: { target: 1500 },
            takeprofit_50k: { target: 3000 },
            takeprofit_100k: { target: 6000 },
            mff_25k: { target: 1250 },
            mff_50k: { target: 2500 },
            mff_100k: { target: 5000 },
            mff_150k: { target: 7500 },
            bluesky_25k: { target: 1500 },
            bluesky_50k: { target: 3000 },
            bluesky_100k: { target: 6250 }
        },
        
        // User inputs
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
        
        // Target simulation
        useTargetSimulation: false,
        target1Contracts: 0,
        target1Points: 10,
        target2Contracts: 0,
        target2Points: 20,
        target3Contracts: 0,
        target3Points: 40,
        
        // Initialize
        init() {
            this.commissionPerRT = this.contracts[this.selectedContract].defaultCommission;
            this.$watch('selectedContract', (value) => {
                this.commissionPerRT = this.contracts[value].defaultCommission;
            });
        },
        
        // Update prop firm target
        updatePropFirmTarget() {
            if (this.selectedPropFirm !== 'custom') {
                this.eaProfitTarget = this.propFirmTargets[this.selectedPropFirm].target;
            }
        },
        
        // Basic calculated properties
        get totalTrades() {
            return this.winningTrades + this.losingTrades;
        },
        
        get winLossPercent() {
            return this.totalTrades > 0 ? Math.round((this.winningTrades / this.totalTrades) * 100) : 0;
        },
        
        get winRate() {
            return this.totalTrades > 0 ? this.winningTrades / this.totalTrades : 0;
        },
        
        get contract() {
            return this.contracts[this.selectedContract];
        },
        
        // Amount calculations
        get avgWinAmount() {
            const effectiveTicks = this.useTargetSimulation ? this.avgExitTicks : this.ticksGained;
            return effectiveTicks * this.contract.tickValue * this.numContracts;
        },
        
        get avgLossAmount() {
            return this.ticksLost * this.contract.tickValue * this.numContracts;
        },
        
        get maxTradeLoss() {
            return this.avgLossAmount;
        },
        
        // R:R calculations
        get rValue() {
            const effectiveTicks = this.useTargetSimulation ? this.avgExitTicks : this.ticksGained;
            return this.ticksLost > 0 ? effectiveTicks / this.ticksLost : 0;
        },
        
        get rRatio() {
            return this.rValue.toFixed(2);
        },
        
        // Expectancy calculation (accounts for win rate)
        get expectancy() {
            // Expectancy = (Win Rate × Average Win) - (Loss Rate × Average Loss)
            const winAmount = this.avgWinAmount - (this.commissionPerRT * this.numContracts);
            const lossAmount = this.avgLossAmount + (this.commissionPerRT * this.numContracts);
            const lossRate = 1 - this.winRate;
            
            return (this.winRate * winAmount) - (lossRate * lossAmount);
        },
        
        get expectancyR() {
            // Expectancy in R terms
            if (this.avgLossAmount === 0) return 0;
            return this.expectancy / this.avgLossAmount;
        },
        
        get expectancyPercent() {
            // Expectancy as percentage of risk
            if (this.avgLossAmount === 0) return 0;
            return (this.expectancy / this.avgLossAmount) * 100;
        },
        
        // P&L calculations
        get grossDailyGain() {
            const totalWinAmount = this.avgWinAmount * this.winningTrades;
            const totalLossAmount = this.avgLossAmount * this.losingTrades;
            return totalWinAmount - totalLossAmount;
        },
        
        get totalCommissions() {
            return this.commissionPerRT * this.totalTrades * this.numContracts * this.numAccounts;
        },
        
        get netDailyGain() {
            return this.grossDailyGain - (this.commissionPerRT * this.totalTrades * this.numContracts);
        },
        
        get grossDailyGainTotal() {
            return this.grossDailyGain * this.numAccounts;
        },
        
        get netDailyGainTotal() {
            return this.netDailyGain * this.numAccounts;
        },
        
        get daysToEATarget() {
            return this.netDailyGain > 0 ? this.eaProfitTarget / this.netDailyGain : 0;
        },
        
        get daysToEATargetAllAccounts() {
            return this.netDailyGainTotal > 0 ? this.eaProfitTarget / this.netDailyGainTotal : 0;
        },
        
        // Target simulation calculations
        get totalTargetContracts() {
            return this.target1Contracts + this.target2Contracts + this.target3Contracts;
        },
        
        get avgExitPoints() {
            if (!this.useTargetSimulation) {
                return this.ticksGained / this.contract.ticksPerPoint;
            }
            // Only calculate if we have valid targets
            const actualContracts = Math.min(this.totalTargetContracts, this.numContracts);
            if (actualContracts === 0) {
                return this.ticksGained / this.contract.ticksPerPoint;
            }
            
            // Calculate weighted average based on actual position size
            let totalPoints = 0;
            let contractsUsed = 0;
            
            // Process targets in order, respecting position size
            if (this.target1Contracts > 0 && contractsUsed < this.numContracts) {
                const contracts = Math.min(this.target1Contracts, this.numContracts - contractsUsed);
                totalPoints += contracts * this.target1Points;
                contractsUsed += contracts;
            }
            
            if (this.target2Contracts > 0 && contractsUsed < this.numContracts) {
                const contracts = Math.min(this.target2Contracts, this.numContracts - contractsUsed);
                totalPoints += contracts * this.target2Points;
                contractsUsed += contracts;
            }
            
            if (this.target3Contracts > 0 && contractsUsed < this.numContracts) {
                const contracts = Math.min(this.target3Contracts, this.numContracts - contractsUsed);
                totalPoints += contracts * this.target3Points;
                contractsUsed += contracts;
            }
            
            return contractsUsed > 0 ? totalPoints / contractsUsed : this.ticksGained / this.contract.ticksPerPoint;
        },
        
        get avgExitTicks() {
            return this.avgExitPoints * this.contract.ticksPerPoint;
        },
        
        get blendedRR() {
            return this.ticksLost > 0 ? this.avgExitTicks / this.ticksLost : 0;
        },
        
        // Setup target presets
        setupTargets(style) {
            const total = this.numContracts;
            if (total === 0) return;
            
            switch(style) {
                case 'conservative':
                    // 60% at 1R, 30% at 2R, 10% at 3R
                    this.target1Contracts = Math.ceil(total * 0.6);
                    this.target2Contracts = Math.floor(total * 0.3);
                    this.target3Contracts = total - this.target1Contracts - this.target2Contracts;
                    this.target1Points = Math.round((this.ticksLost / this.contract.ticksPerPoint) * 1);
                    this.target2Points = Math.round((this.ticksLost / this.contract.ticksPerPoint) * 2);
                    this.target3Points = Math.round((this.ticksLost / this.contract.ticksPerPoint) * 3);
                    break;
                    
                case 'moderate':
                    // 40% at 1.5R, 40% at 2.5R, 20% at 4R
                    this.target1Contracts = Math.ceil(total * 0.4);
                    this.target2Contracts = Math.ceil(total * 0.4);
                    this.target3Contracts = total - this.target1Contracts - this.target2Contracts;
                    this.target1Points = Math.round((this.ticksLost / this.contract.ticksPerPoint) * 1.5);
                    this.target2Points = Math.round((this.ticksLost / this.contract.ticksPerPoint) * 2.5);
                    this.target3Points = Math.round((this.ticksLost / this.contract.ticksPerPoint) * 4);
                    break;
                    
                case 'aggressive':
                    // 20% at 2R, 30% at 3R, 50% at 5R
                    this.target1Contracts = Math.ceil(total * 0.2);
                    this.target2Contracts = Math.floor(total * 0.3);
                    this.target3Contracts = total - this.target1Contracts - this.target2Contracts;
                    this.target1Points = Math.round((this.ticksLost / this.contract.ticksPerPoint) * 2);
                    this.target2Points = Math.round((this.ticksLost / this.contract.ticksPerPoint) * 3);
                    this.target3Points = Math.round((this.ticksLost / this.contract.ticksPerPoint) * 5);
                    break;
            }
        }
    }
}