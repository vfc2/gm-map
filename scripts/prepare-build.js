// This script ensures the correct base path is set for the build
// It's needed to make PR previews work correctly on GitHub Pages

// Load the BASE_PATH from environment or .env file
import { config } from 'dotenv';
import fs from 'fs';

// Load .env file if exists
config();

// Get the base path
const basePath = process.env.BASE_PATH || '';

console.log(`Configuring build with base path: ${basePath}`);

// Create a custom _redirects file for Netlify-style redirects
// This helps with SPA routing on GitHub Pages
if (basePath) {
	// Write paths to environment file for Vite and SvelteKit to use
	fs.writeFileSync('.env', `PUBLIC_BASE_PATH=${basePath}`);

	console.log('Creating build environment with base path:', basePath);

	// Create a JS file that will set the base path at runtime
	const runtimeConfig = `window.APP_BASE_PATH = "${basePath}";`;

	if (!fs.existsSync('./static')) {
		fs.mkdirSync('./static');
	}

	fs.writeFileSync('./static/path-config.js', runtimeConfig);
	console.log('Created path-config.js with runtime base path configuration');
}
