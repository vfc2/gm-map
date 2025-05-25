# PR Preview Deployment

This guide explains how PR previews work in this project.

## How it Works

When a PR is created or updated, a GitHub Action workflow automatically:

1. Builds the SvelteKit application with a special base path for this PR
2. Deploys the build to the `gh-pages` branch under a PR-specific subdirectory
3. Comments on the PR with a link to the preview

## Requirements

For PR previews to work:

1. GitHub Pages must be enabled for the repository and configured to deploy from the `gh-pages` branch
2. The workflow must have permission to write to the `gh-pages` branch and comment on PRs
3. The SvelteKit configuration must handle the custom base path

## Troubleshooting

If PR previews aren't working:

1. Check GitHub Pages is enabled in repository settings
2. Verify the GitHub Actions workflow has the necessary permissions
3. Check the build logs to see if there were any errors during build
4. Inspect browser console errors on the preview page if it's blank

## Configuration Files

The PR preview functionality is controlled by:

1. `.github/workflows/pr-preview.yml` - The GitHub Action workflow
2. `svelte.config.js` - SvelteKit configuration that handles the base path
3. `vite.config.ts` - Vite configuration that sets the base URL during build
4. `static/404.html` - Handles SPA redirects for client-side routing
