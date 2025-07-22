# Cloudflare Pages Build Setup

This document explains how to deploy the Futures Trading Risk Management Calculator to Cloudflare Pages with proper Tailwind CSS builds.

## Issues Fixed

1. **Alpine.js Initialization**: Fixed the order of script loading to ensure calculator.js loads before Alpine.js initializes
2. **Tailwind CSS Production Build**: Replaced Tailwind CDN with a proper build process

## Deployment Options

### Option 1: Pre-build Locally and Commit (Recommended for simplicity)

1. Install dependencies locally:
   ```bash
   npm install
   ```

2. Build the CSS:
   ```bash
   npm run build
   ```

3. Commit the built CSS file:
   ```bash
   git add dist/output.css
   git commit -m "Build Tailwind CSS for production"
   ```

4. In Cloudflare Pages settings:
   - Build command: (leave empty)
   - Build output directory: `/`
   - Root directory: `/`

### Option 2: Build on Cloudflare Pages

1. Ensure `dist/` is in `.gitignore` (uncomment the line)

2. In Cloudflare Pages settings:
   - Build command: `npm install && npm run build`
   - Build output directory: `/`
   - Root directory: `/`
   - Node.js version: 18 or higher

## File Structure

```
/
├── src/
│   └── input.css         # Tailwind input file with custom styles
├── dist/
│   └── output.css        # Built CSS file (generated)
├── index.html            # Main HTML file
├── calculator.js         # Alpine.js components
├── tailwind.config.js    # Tailwind configuration
├── postcss.config.js     # PostCSS configuration
└── package.json          # Build scripts and dependencies
```

## Build Scripts

- `npm run build`: Build CSS for production (minified)
- `npm run dev`: Watch mode for development
- `npm run build:css`: Direct Tailwind build command

## Changes Made

1. **index.html**:
   - Moved `calculator.js` before Alpine.js initialization
   - Replaced Tailwind CDN with link to `dist/output.css`
   - Removed inline Tailwind config

2. **package.json**:
   - Added Tailwind CSS, PostCSS, and Autoprefixer as dev dependencies
   - Added build scripts for CSS compilation

3. **New Files**:
   - `tailwind.config.js`: Tailwind configuration with content paths and dark mode
   - `postcss.config.js`: PostCSS configuration for Tailwind
   - `src/input.css`: Source CSS with Tailwind directives and custom styles

## Testing Locally

To test the production build locally:

```bash
npm install
npm run build
# Open index.html in a browser
```

## Troubleshooting

If you still see errors after deployment:

1. **Clear Cloudflare cache**: Go to your Cloudflare dashboard and purge cache
2. **Check browser console**: Ensure no 404 errors for CSS or JS files
3. **Verify paths**: Ensure all file paths in index.html are relative (no leading `/`)

## Dark Mode

The calculator supports dark mode through:
- System preference detection
- Manual toggle button
- LocalStorage persistence
- Tailwind's `dark:` variant classes

All dark mode styles are included in the production build.