# Cache Busting Strategy

This document explains the cache busting implementation for the Futures Trading Risk Management Calculator.

## Overview

Cache busting ensures users always receive the latest version of JavaScript and CSS files by appending version query parameters to asset URLs.

## Implementation

### 1. Version Query Parameters

Assets in `index.html` now include version parameters:
- `calculator.js?v=1.0.0`
- `dist/output.css?v=1.0.0`

### 2. Cache Headers Configuration

The `_headers` file has been updated with the following strategy:

- **JavaScript & CSS files**: 1-hour cache with `must-revalidate`
  - `Cache-Control: public, max-age=3600, must-revalidate`
  - Forces browser to check for updates after 1 hour

- **HTML files**: No caching
  - `Cache-Control: no-cache, no-store, must-revalidate`
  - Ensures index.html is always fresh

### 3. Build Scripts

Two versioning strategies are available:

#### Package Version (Recommended)
```bash
npm run build
```
- Uses version from package.json
- Updates asset URLs to match package version

#### Timestamp Version
```bash
npm run build:timestamp
```
- Uses current timestamp
- Guarantees unique version on every build

### 4. Version Management

To bump version and update assets:
```bash
npm run version:bump
```
This will:
1. Increment patch version in package.json
2. Update all asset URLs with new version

## Usage

### Development
```bash
npm run dev
```
No version updates during development.

### Production Build
```bash
npm run build
```
Automatically updates asset versions using package.json version.

### Manual Version Update
```bash
npm run version:update
```
Updates asset URLs without rebuilding CSS.

## Benefits

1. **Prevents stale cache**: Users always get latest JavaScript/CSS
2. **Controlled caching**: 1-hour cache reduces server load while ensuring updates
3. **Version tracking**: Package version in URLs helps identify deployed version
4. **Cloudflare Pages compatible**: Works seamlessly with Cloudflare's edge caching

## Troubleshooting

If users still see old versions:
1. Clear browser cache
2. Use timestamp versioning for immediate updates
3. Check Cloudflare cache purge if needed