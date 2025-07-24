import type { 
    RiskCalculatorComponent, 
    ContractSymbol, 
    Contracts, 
    PropFirmTargets, 
    PropFirmType,
    FuturesContract 
} from './types';

// Declare global html2canvas function
declare global {
    function html2canvas(element: Element, options?: any): Promise<HTMLCanvasElement>;
}

// Declare Alpine.js types for the component
declare module 'alpinejs' {
    interface Stores {
        darkMode: {
            on: boolean;
            toggle(): void;
            init(): void;
        };
    }
}

// Futures Trading Risk Management Calculator
function riskCalculator(): RiskCalculatorComponent {
    const component: RiskCalculatorComponent = {
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
        } as Contracts,
        
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
        } as PropFirmTargets,
        
        // User inputs
        selectedContract: 'MNQ' as ContractSymbol,
        selectedPropFirm: 'custom' as PropFirmType,
        winningTrades: 2,
        losingTrades: 2,
        ticksGained: 120,
        ticksLost: 68,
        numContracts: 1,
        numAccounts: 1,
        commissionPerRT: 1.35,
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
        
        // Breakeven simulation
        useBreakevenStop: false,
        breakevenTriggerPoints: 10,
        breakevenWinRate: 0.30,
        
        // Sharing
        showShareModal: false,
        shareURL: '',
        copied: false,
        
        // UI preferences
        showDetailedView: false,
        
        // Initialize
        init(this: RiskCalculatorComponent & { $watch: Function }): void {
            // Ensure modal is closed on init
            this.showShareModal = false;
            this.copied = false;
            
            this.commissionPerRT = this.contracts[this.selectedContract].defaultCommission;
            this.$watch('selectedContract', (value: ContractSymbol) => {
                this.commissionPerRT = this.contracts[value].defaultCommission;
            });
            
            // Load from URL if parameters exist
            this.loadFromURL();
        },
        
        // Update prop firm target
        updatePropFirmTarget(): void {
            if (this.selectedPropFirm !== 'custom') {
                this.eaProfitTarget = this.propFirmTargets[this.selectedPropFirm].target;
            }
        },
        
        // Basic calculated properties
        get totalTrades(): number {
            return this.winningTrades + this.losingTrades;
        },
        
        get winLossPercent(): number {
            return this.totalTrades > 0 ? Math.round((this.winningTrades / this.totalTrades) * 100) : 0;
        },
        
        get winRate(): number {
            return this.totalTrades > 0 ? this.winningTrades / this.totalTrades : 0;
        },
        
        get contract(): FuturesContract {
            return this.contracts[this.selectedContract];
        },
        
        // Amount calculations
        get avgWinAmount(): number {
            const effectiveTicks = this.useTargetSimulation ? this.avgExitTicks : this.ticksGained;
            return effectiveTicks * this.contract.tickValue * this.numContracts;
        },
        
        get avgLossAmount(): number {
            return this.ticksLost * this.contract.tickValue * this.numContracts;
        },
        
        get maxTradeLoss(): number {
            return this.avgLossAmount;
        },
        
        get maxTradeGain(): number {
            return this.avgWinAmount;
        },
        
        // R:R calculations
        get rValue(): number {
            const effectiveTicks = this.useTargetSimulation ? this.avgExitTicks : this.ticksGained;
            return this.ticksLost > 0 ? effectiveTicks / this.ticksLost : 0;
        },
        
        get rRatio(): string {
            return this.rValue.toFixed(2);
        },
        
        // Expectancy calculation (accounts for win rate)
        get expectancy(): number {
            const winAmount = this.avgWinAmount - (this.commissionPerRT * this.numContracts);
            const lossAmount = this.avgLossAmount + (this.commissionPerRT * this.numContracts);
            const lossRate = 1 - this.winRate;
            
            return (this.winRate * winAmount) - (lossRate * lossAmount);
        },
        
        get expectancyR(): number {
            if (this.avgLossAmount === 0) return 0;
            return this.expectancy / this.avgLossAmount;
        },
        
        get expectancyPercent(): number {
            if (this.avgLossAmount === 0) return 0;
            return (this.expectancy / this.avgLossAmount) * 100;
        },
        
        // Breakeven adjusted calculations
        get breakevenAdjustedWinRate(): number {
            if (!this.useBreakevenStop) return this.winRate;
            
            // Calculate percentage of trades reaching BE based on trigger points
            // The further the BE trigger, the fewer trades reach it
            const percentReachingBE = this.calculateBreakevenReachRate();
            
            const tradesReachingBE = this.winRate * percentReachingBE;
            const tradesNotReachingBE = this.winRate * (1 - percentReachingBE);
            const actualWins = tradesNotReachingBE + (tradesReachingBE * this.breakevenWinRate);
            
            return actualWins;
        },
        
        get breakevenScratchRate(): number {
            if (!this.useBreakevenStop) return 0;
            
            const percentReachingBE = this.calculateBreakevenReachRate();
            const tradesReachingBE = this.winRate * percentReachingBE;
            return tradesReachingBE * (1 - this.breakevenWinRate);
        },
        
        // Calculate what percentage of winning trades reach the breakeven trigger
        calculateBreakevenReachRate(): number {
            // Convert trigger points to ticks for comparison
            const triggerTicks = this.breakevenTriggerPoints * this.contract.ticksPerPoint;
            const avgWinTicks = this.useTargetSimulation ? this.avgExitTicks : this.ticksGained;
            
            // If trigger is beyond average win, very few trades reach it
            if (triggerTicks >= avgWinTicks) {
                return 0.1; // Only 10% reach BE if trigger is at or beyond target
            }
            
            // Calculate reach rate based on trigger distance
            // The closer the trigger to entry (0), the more trades reach it
            const reachRate = 1 - (triggerTicks / avgWinTicks);
            
            // Clamp between 0.1 and 0.95
            return Math.max(0.1, Math.min(0.95, reachRate));
        },
        
        get breakevenAdjustedExpectancy(): number {
            if (!this.useBreakevenStop) return this.expectancy;
            
            const winAmount = this.avgWinAmount - (this.commissionPerRT * this.numContracts);
            const lossAmount = this.avgLossAmount + (this.commissionPerRT * this.numContracts);
            const scratchAmount = -(this.commissionPerRT * this.numContracts);
            
            const actualWinRate = this.breakevenAdjustedWinRate;
            const scratchRate = this.breakevenScratchRate;
            const lossRate = 1 - actualWinRate - scratchRate;
            
            return (actualWinRate * winAmount) + (scratchRate * scratchAmount) - (lossRate * lossAmount);
        },
        
        // P&L calculations
        get grossDailyGain(): number {
            if (!this.useBreakevenStop) {
                const totalWinAmount = this.avgWinAmount * this.winningTrades;
                const totalLossAmount = this.avgLossAmount * this.losingTrades;
                return totalWinAmount - totalLossAmount;
            }
            
            // When using breakeven stops, calculate based on adjusted rates
            const actualWins = this.breakevenAdjustedWinRate * this.totalTrades;
            const actualLosses = (1 - this.breakevenAdjustedWinRate - this.breakevenScratchRate) * this.totalTrades;
            
            const totalWinAmount = this.avgWinAmount * actualWins;
            const totalLossAmount = this.avgLossAmount * actualLosses;
            return totalWinAmount - totalLossAmount;
        },
        
        get totalCommissions(): number {
            return this.commissionPerRT * this.totalTrades * this.numContracts * this.numAccounts;
        },
        
        get netDailyGain(): number {
            if (!this.useBreakevenStop) {
                return this.grossDailyGain - (this.commissionPerRT * this.totalTrades * this.numContracts);
            }
            
            // Use breakeven-adjusted expectancy * total trades for more accurate calculation
            return this.breakevenAdjustedExpectancy * this.totalTrades;
        },
        
        get grossDailyGainTotal(): number {
            return this.grossDailyGain * this.numAccounts;
        },
        
        get netDailyGainTotal(): number {
            return this.netDailyGain * this.numAccounts;
        },
        
        get daysToEATarget(): number {
            return this.netDailyGain > 0 ? this.eaProfitTarget / this.netDailyGain : 0;
        },
        
        get daysToEATargetAllAccounts(): number {
            return this.netDailyGainTotal > 0 ? this.eaProfitTarget / this.netDailyGainTotal : 0;
        },
        
        // Target simulation calculations
        get totalTargetContracts(): number {
            return this.target1Contracts + this.target2Contracts + this.target3Contracts;
        },
        
        get avgExitPoints(): number {
            if (!this.useTargetSimulation) {
                return this.ticksGained / this.contract.ticksPerPoint;
            }
            
            const actualContracts = Math.min(this.totalTargetContracts, this.numContracts);
            if (actualContracts === 0) {
                return this.ticksGained / this.contract.ticksPerPoint;
            }
            
            let totalPoints = 0;
            let contractsUsed = 0;
            
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
        
        get avgExitTicks(): number {
            return this.avgExitPoints * this.contract.ticksPerPoint;
        },
        
        get blendedRR(): number {
            return this.ticksLost > 0 ? this.avgExitTicks / this.ticksLost : 0;
        },
        
        // Setup target presets
        setupTargets(style: 'conservative' | 'moderate' | 'aggressive'): void {
            const total = this.numContracts;
            if (total === 0) return;
            
            switch(style) {
                case 'conservative':
                    this.target1Contracts = Math.ceil(total * 0.6);
                    this.target2Contracts = Math.floor(total * 0.3);
                    this.target3Contracts = total - this.target1Contracts - this.target2Contracts;
                    this.target1Points = Math.round((this.ticksLost / this.contract.ticksPerPoint) * 1);
                    this.target2Points = Math.round((this.ticksLost / this.contract.ticksPerPoint) * 2);
                    this.target3Points = Math.round((this.ticksLost / this.contract.ticksPerPoint) * 3);
                    break;
                    
                case 'moderate':
                    this.target1Contracts = Math.ceil(total * 0.4);
                    this.target2Contracts = Math.ceil(total * 0.4);
                    this.target3Contracts = total - this.target1Contracts - this.target2Contracts;
                    this.target1Points = Math.round((this.ticksLost / this.contract.ticksPerPoint) * 1.5);
                    this.target2Points = Math.round((this.ticksLost / this.contract.ticksPerPoint) * 2.5);
                    this.target3Points = Math.round((this.ticksLost / this.contract.ticksPerPoint) * 4);
                    break;
                    
                case 'aggressive':
                    this.target1Contracts = Math.ceil(total * 0.2);
                    this.target2Contracts = Math.floor(total * 0.3);
                    this.target3Contracts = total - this.target1Contracts - this.target2Contracts;
                    this.target1Points = Math.round((this.ticksLost / this.contract.ticksPerPoint) * 2);
                    this.target2Points = Math.round((this.ticksLost / this.contract.ticksPerPoint) * 3);
                    this.target3Points = Math.round((this.ticksLost / this.contract.ticksPerPoint) * 5);
                    break;
            }
        },
        
        // URL Sharing functionality
        shareAsURL(): void {
            const params = new URLSearchParams({
                c: this.selectedContract,
                wt: this.winningTrades.toString(),
                lt: this.losingTrades.toString(),
                tg: this.ticksGained.toString(),
                tl: this.ticksLost.toString(),
                nc: this.numContracts.toString(),
                na: this.numAccounts.toString(),
                cr: this.commissionPerRT.toString(),
                pf: this.selectedPropFirm,
                pt: this.eaProfitTarget.toString(),
                cd: this.customDays.toString(),
                ts: this.useTargetSimulation ? '1' : '0',
                t1c: this.target1Contracts.toString(),
                t1p: this.target1Points.toString(),
                t2c: this.target2Contracts.toString(),
                t2p: this.target2Points.toString(),
                t3c: this.target3Contracts.toString(),
                t3p: this.target3Points.toString(),
                bes: this.useBreakevenStop ? '1' : '0',
                btp: this.breakevenTriggerPoints.toString(),
                bwr: this.breakevenWinRate.toString(),
                dv: this.showDetailedView ? '1' : '0'
            });
            
            this.shareURL = window.location.origin + window.location.pathname + '?' + params.toString();
            this.showShareModal = true;
            this.copied = false;
        },
        
        async copyShareURL(): Promise<void> {
            try {
                await navigator.clipboard.writeText(this.shareURL);
                this.copied = true;
                setTimeout(() => { this.copied = false; }, 2000);
            } catch (error) {
                console.error('Failed to copy URL:', error);
            }
        },
        
        loadFromURL(): void {
            const params = new URLSearchParams(window.location.search);
            
            if (params.has('c')) {
                this.selectedContract = (params.get('c') || 'MNQ') as ContractSymbol;
                this.winningTrades = parseInt(params.get('wt') || '2');
                this.losingTrades = parseInt(params.get('lt') || '2');
                this.ticksGained = parseInt(params.get('tg') || '120');
                this.ticksLost = parseInt(params.get('tl') || '68');
                this.numContracts = parseInt(params.get('nc') || '1');
                this.numAccounts = parseInt(params.get('na') || '1');
                this.commissionPerRT = parseFloat(params.get('cr') || this.contracts[this.selectedContract].defaultCommission.toString());
                this.selectedPropFirm = (params.get('pf') || 'custom') as PropFirmType;
                this.eaProfitTarget = parseInt(params.get('pt') || '6000');
                this.customDays = parseInt(params.get('cd') || '235');
                
                this.useTargetSimulation = params.get('ts') === '1';
                this.target1Contracts = parseInt(params.get('t1c') || '0');
                this.target1Points = parseInt(params.get('t1p') || '10');
                this.target2Contracts = parseInt(params.get('t2c') || '0');
                this.target2Points = parseInt(params.get('t2p') || '20');
                this.target3Contracts = parseInt(params.get('t3c') || '0');
                this.target3Points = parseInt(params.get('t3p') || '40');
                
                this.useBreakevenStop = params.get('bes') === '1';
                this.breakevenTriggerPoints = parseInt(params.get('btp') || '10');
                this.breakevenWinRate = parseFloat(params.get('bwr') || '0.30');
                
                this.showDetailedView = params.get('dv') === '1';
            }
        },
        
        // Save as image functionality
        async saveAsImage(): Promise<void> {
            const button = (event?.target as HTMLElement)?.closest('button');
            if (!button) return;
            
            const originalText = button.innerHTML;
            button.innerHTML = 'Generating...';
            button.disabled = true;
            
            const allButtons = document.querySelectorAll('button');
            
            try {
                allButtons.forEach((btn: Element) => (btn as HTMLElement).style.display = 'none');
                
                const element = document.querySelector('.max-w-7xl');
                if (!element) throw new Error('Content element not found');
                
                const isDarkMode = document.documentElement.classList.contains('dark');
                const canvas = await html2canvas(element, {
                    backgroundColor: isDarkMode ? '#111827' : '#f3f4f6',
                    scale: 2,
                    logging: false,
                    useCORS: true,
                    allowTaint: true,
                    onclone: (clonedDoc: Document) => {
                        if (isDarkMode) {
                            clonedDoc.documentElement.classList.add('dark');
                            const clonedElement = clonedDoc.querySelector('.max-w-7xl') as HTMLElement;
                            if (clonedElement) {
                                clonedElement.style.backgroundColor = '#111827';
                                clonedElement.style.color = '#f3f4f6';
                            }
                        }
                    }
                });
                
                allButtons.forEach((btn: Element) => (btn as HTMLElement).style.display = '');
                
                const link = document.createElement('a');
                link.download = `profitpath-${this.selectedContract}-${new Date().toISOString().split('T')[0]}.png`;
                link.href = canvas.toDataURL();
                link.click();
                
                button.innerHTML = originalText;
                button.disabled = false;
            } catch (error) {
                console.error('Error saving image:', error);
                alert('Error saving image. Please try again.');
                button.innerHTML = originalText;
                button.disabled = false;
                allButtons.forEach((btn: Element) => (btn as HTMLElement).style.display = '');
            }
        }
    };
    
    return component;
}

// Export for use in browser
export { riskCalculator };
(window as any).riskCalculator = riskCalculator;