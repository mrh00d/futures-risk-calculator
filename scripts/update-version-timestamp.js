#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Generate timestamp version
const timestamp = new Date().getTime();

// Path to index.html
const indexPath = path.join(__dirname, '..', 'index.html');

// Read index.html
let html = fs.readFileSync(indexPath, 'utf8');

// Update version parameters for assets with timestamp
// Update CSS link
html = html.replace(
  /(<link\s+rel="stylesheet"\s+href="dist\/output\.css)(\?v=[^"]*)?(")/,
  `$1?v=${timestamp}$3`
);

// Update JS script
html = html.replace(
  /(<script\s+src="calculator\.js)(\?v=[^"]*)?(")/,
  `$1?v=${timestamp}$3`
);

// Write updated HTML back
fs.writeFileSync(indexPath, html);

// Update service worker cache version with timestamp
const swPath = path.join(__dirname, '..', 'sw.js');
if (fs.existsSync(swPath)) {
  let swContent = fs.readFileSync(swPath, 'utf8');
  swContent = swContent.replace(
    /const CACHE_NAME = 'futures-calc-v[^']+'/,
    `const CACHE_NAME = 'futures-calc-v${timestamp}'`
  );
  fs.writeFileSync(swPath, swContent);
  console.log(`Updated service worker cache version with timestamp: ${timestamp}`);
}

console.log(`Updated asset versions with timestamp: ${timestamp}`);