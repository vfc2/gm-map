# GitHub Pages Setup for PR Previews

This document explains how to set up GitHub Pages for PR previews in this repository.

## Initial Setup

1. Go to the repository settings on GitHub:

   - Navigate to `Settings` > `Pages`
   - Under "Source", select "Deploy from a branch"
   - Select the `gh-pages` branch and `/ (root)` folder
   - Click "Save"

2. Run the GitHub Pages setup workflow manually:

   - Go to the "Actions" tab in the repository
   - Select the "Setup GitHub Pages" workflow
   - Click "Run workflow" on the main branch
   - This will create the `gh-pages` branch if it doesn't exist and configure it for GitHub Pages

3. Configure branch protection (optional but recommended):
   - Navigate to `Settings` > `Branches`
   - Add a branch protection rule for `main`
   - Enable "Require status checks to pass before merging"
   - Add the PR preview workflow as a required status check

## How PR Previews Work

When a pull request is opened or updated, the PR preview workflow:

1. Builds the SvelteKit application with the correct base path for the PR
2. Deploys the build to the `gh-pages` branch in a folder specific to the PR number
3. Comments on the PR with a link to the preview

The preview URL will be in the format:
`https://vfc2.github.io/gm-map/pr-preview/pr-[PR_NUMBER]`

## Troubleshooting

If PR previews aren't working:

1. Make sure GitHub Pages is properly configured in the repository settings
2. Check that the workflow has the correct permissions to write to the repository
3. Ensure that the gh-pages branch exists and is properly configured
4. If needed, run the GitHub Pages setup workflow manually

### Blank Page Issues

If you see a blank page with the preview:

1. Open the browser developer console (F12) to check for errors
2. Look for 404 errors when loading JavaScript modules or assets
   - If files are looking for paths like `/_app/...` instead of `/gm-map/pr-preview/pr-X/_app/...`
   - This indicates a base path configuration issue
3. Verify the `PUBLIC_BASE_PATH` environment variable is correctly set during build
4. Check that the `window.APP_BASE_PATH` is properly defined in the path-config.js file
5. Make sure vite.config.ts and svelte.config.js are correctly using the base path

### Loading Module Errors

If you see errors like `Failed to fetch dynamically imported module`:

1. The most common cause is incorrect base path configuration
2. Check the path in the error message - it should include the full path with `/gm-map/pr-preview/pr-X/`
3. Run a test build locally with the BASE_PATH environment variable set to the same value used in the workflow:
   ```bash
   BASE_PATH='/gm-map/pr-preview/pr-X' npm run build
   ```
4. Inspect the generated HTML in the build folder to ensure paths include the base path

### Permission Issues

If the workflow fails due to permissions:

1. Make sure the workflow has appropriate permissions:
   ```yaml
   permissions:
     contents: write # Needed to write to the gh-pages branch
     pull-requests: write # Needed to comment on pull requests
   ```
2. Ensure there are no branch protection rules blocking the workflow from writing to the gh-pages branch
