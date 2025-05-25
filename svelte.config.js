import adapter from '@sveltejs/adapter-static'; // Using static adapter for GitHub Pages
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// We're using adapter-static for GitHub Pages deployment
		adapter: adapter({
			// Default options
			pages: 'build',
			assets: 'build',
			fallback: 'index.html',
			precompress: false,
			strict: true
		}),
		// Ensure paths work correctly in GitHub Pages subdirectories
		paths: {
			base: process.env.BASE_PATH || ''
		}
	}
};

export default config;
