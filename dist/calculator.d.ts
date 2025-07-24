import type { AlpineComponent, RiskCalculatorComponent } from './types';
declare global {
    interface Window {
        riskCalculator: () => AlpineComponent<RiskCalculatorComponent>;
    }
}
declare function riskCalculator(): AlpineComponent<RiskCalculatorComponent>;
export { riskCalculator };
//# sourceMappingURL=calculator.d.ts.map