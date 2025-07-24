/**
 * ProfitPath Futures Trading Calculator
 * Main entry point
 */
export * from './types';
export * from './constants';
export * from './calculations';
export { riskCalculator } from './calculator';
// Re-export for browser global
import { riskCalculator } from './calculator';
if (typeof window !== 'undefined') {
    window.riskCalculator = riskCalculator;
}
