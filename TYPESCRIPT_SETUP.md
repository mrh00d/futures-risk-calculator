# TypeScript Build Pipeline Setup

This document describes the TypeScript build pipeline for the ProfitPath futures trading calculator.

## Overview

The TypeScript setup provides:
- Strong typing for all calculator components
- Better IDE support with IntelliSense
- Compile-time error checking
- Modular code organization
- Minified production builds

## Project Structure

```
src/
├── index.ts         # Main entry point
├── calculator.ts    # Main calculator component
├── types.ts         # TypeScript type definitions
├── constants.ts     # Constants and configurations
└── calculations.ts  # Calculation utilities

dist/
├── calculator.min.js     # Minified production build
├── calculator.js         # Development build
├── *.d.ts               # TypeScript declaration files
└── *.map                # Source maps
```

## Type Definitions

### Core Types

- `FuturesContract`: Contract specifications (tick value, point value, etc.)
- `PropFirmTarget`: Prop firm profit targets
- `CalculatorState`: Main calculator state interface
- `CalculatedMetrics`: Computed metrics interface
- `TargetSimulation`: Multi-target exit simulation
- `BreakevenSimulation`: Breakeven stop simulation

### Alpine.js Integration

The `AlpineComponent<T>` type provides TypeScript support for Alpine.js components.

## Build Scripts

### Development
```bash
npm run dev
```
Runs both CSS and TypeScript watchers concurrently.

### Production Build
```bash
npm run build
```
Builds minified CSS and JavaScript with source maps.

### Type Checking
```bash
npm run typecheck
```
Runs TypeScript compiler without emitting files to check for type errors.

## Configuration Files

### tsconfig.json
- Target: ES2020
- Module: ESNext
- Strict mode enabled
- Source maps and declarations generated
- Output directory: `./dist`
- Root directory: `./src`

### esbuild Configuration
- Bundle format: IIFE
- Target: ES2020
- Minification enabled for production
- Source maps included
- Global name: `ProfitPath`

## Adding New Features

1. Define types in `src/types.ts`
2. Add constants to `src/constants.ts`
3. Implement calculations in `src/calculations.ts`
4. Update main component in `src/calculator.ts`
5. Run `npm run typecheck` to verify types
6. Build with `npm run build`

## Dependencies

- **typescript**: TypeScript compiler
- **esbuild**: Fast JavaScript bundler
- **@types/alpinejs**: Alpine.js type definitions
- **concurrently**: Run multiple npm scripts concurrently

## Browser Compatibility

The build targets ES2020, which is supported by:
- Chrome 80+
- Firefox 72+
- Safari 14+
- Edge 80+

For older browser support, adjust the target in package.json build scripts.