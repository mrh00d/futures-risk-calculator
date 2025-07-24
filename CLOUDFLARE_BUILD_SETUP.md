# Cloudflare Pages Build Setup

This document explains how to deploy the ProfitPath Calculator (TypeScript version) to Cloudflare Pages.

## Project Structure

The project uses TypeScript and requires building both TypeScript and Tailwind CSS files.

## Deployment Options

### Option 1: Pre-build Locally and Commit (Recommended for simplicity)

1. Install dependencies locally:
   ```bash
   npm install
   ```

2. Build both TypeScript and CSS:
   ```bash
   npm run build
   ```

3. Commit the built files:
   ```bash
   git add dist/
   git commit -m "Build TypeScript and CSS for production"
   git push
   ```

4. In Cloudflare Pages settings:
   - Build command: (leave empty)
   - Build output directory: `/`
   - Root directory: `/`

### Option 2: Build on Cloudflare Pages

1. Ensure `dist/` is in `.gitignore`

2. In Cloudflare Pages settings:
   - Build command: `npm install && npm run build`
   - Build output directory: `/`
   - Root directory: `/`
   - Node.js version: 18 or higher

## File Structure

```
/
├── src/
│   ├── calculator.ts     # Main TypeScript calculator logic
│   ├── types.ts          # TypeScript type definitions
│   ├── constants.ts      # Constants and configuration
│   ├── utils.ts          # Utility functions
│   ├── index.ts          # Entry point for bundling
│   └── input.css         # Tailwind input file with custom styles
├── dist/
│   ├── calculator.min.js # Built TypeScript bundle (generated)
│   └── output.css        # Built CSS file (generated)
├── index.html            # Main HTML file
├── tsconfig.json         # TypeScript configuration
├── tailwind.config.js    # Tailwind configuration
├── postcss.config.js     # PostCSS configuration
└── package.json          # Build scripts and dependencies
```

## Build Scripts

- `npm run build`: Builds both TypeScript and CSS for production
- `npm run build:ts`: Compiles TypeScript and creates minified bundle
- `npm run build:css`: Builds Tailwind CSS (minified)
- `npm run dev`: Watches TypeScript files for changes
- `npm run dev:css`: Watches CSS files for changes

## Important Notes

1. **index.html Location**: The `index.html` file must remain in the root directory (not in `/dist`)
2. **Asset Paths**: The index.html references assets in the `dist/` folder:
   - `<script src="dist/calculator.min.js"></script>`
   - `<link rel="stylesheet" href="dist/output.css">`
3. **Build Output**: Always use `/` as the build output directory in Cloudflare, NOT `/dist`

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