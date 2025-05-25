# PR Preview with Vercel

This document explains how to use Vercel for PR preview deployments of this SvelteKit application.

## Overview

We use Vercel to automatically deploy preview versions of pull requests, which allows reviewers to view and test changes before merging.

## How It Works

1. When a pull request is opened or updated, Vercel automatically:

   - Builds the application
   - Deploys it to a unique URL
   - Adds a comment on the PR with the preview URL

2. Team members can click the preview URL to see the changes in a live environment.

3. When the PR is merged, the preview deployment is automatically removed.

## Setup

Vercel has already been set up for this repository. The connection between GitHub and Vercel enables automatic preview deployments.

## Troubleshooting

If preview deployments aren't working:

1. Check the Vercel dashboard for build errors
2. Ensure the PR is from a branch in this repository (not a fork)
3. Check that the SvelteKit build completes successfully locally

## Benefits Over GitHub Pages PR Previews

- No manual workflow configuration needed
- Each PR gets a unique, persistent URL
- Automatic cleanup when PRs are merged
- Built-in redirect handling for SvelteKit SPA routes
- Edge network deployment for better performance
