# GitHub Pages PR Preview System

This document explains how the PR Preview system works for this SvelteKit application on GitHub Pages.

## Overview

The PR Preview system automatically deploys a preview of every pull request to a unique URL, allowing reviewers to see the changes in action before merging.

## How It Works

1. When a PR is opened or updated, the GitHub Actions workflow in `.github/workflows/pr-preview.yml` runs
2. It builds the SvelteKit app with a special base path: `/gm-map/pr-preview/pr-XX` (where XX is the PR number)
3. The built app is deployed to the `gh-pages` branch in a subfolder matching the base path
4. A comment is posted on the PR with a link to the preview

## Key Features

### Base Path Handling

SvelteKit apps need special configuration to run correctly in subdirectories (like PR preview paths). We handle this through:

- Setting `kit.paths.base` in `svelte.config.js` to the PR preview path
- Creating runtime configuration in `path-config.js` that's loaded before the app
- Using SPA mode (no SSR) with static adapter configuration

### SPA Routing for GitHub Pages

GitHub Pages doesn't natively support SPA routing, so we've implemented:

- A `404.html` file that redirects page requests to the main app with the correct path
- Client-side routing helpers in `pr-preview-helper.js` to fix paths and assets
- Special handling for assets and links to ensure they include the base path

### Debugging Tools

The PR preview includes special debugging tools:

- A debug panel showing the base path and other information
- Console logging for path resolution
- PR preview indicator in the UI

## Configuration Files

The system involves several key files:

1. **PR Workflow**: `.github/workflows/pr-preview.yml`
2. **SvelteKit Config**: `svelte.config.js`
3. **Vite Config**: `vite.config.ts`
4. **Path Utilities**: `src/lib/utils/path.ts`
5. **App HTML Template**: `src/app.html`
6. **PR Preview Helpers**: `static/pr-preview-helper.js` and `static/pr-preview.css`
7. **SPA Routing**: `static/404.html`

## Troubleshooting

If the PR preview shows a blank page:

1. Check browser console for script loading errors
2. Verify the base path is correctly set in path-config.js
3. Check that all JavaScript modules have the correct path
4. Ensure .nojekyll file is present to prevent GitHub Pages processing

## Deployment Process

The deployment process follows these steps:

1. Set environment variables with the correct base path
2. Generate runtime configuration files
3. Build the SvelteKit app in static mode
4. Deploy to the gh-pages branch in the correct subfolder
5. Post a comment with the preview link

For more details, see the implementation in the workflow files and source code.
