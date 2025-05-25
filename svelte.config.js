import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		// Configure the static adapter with fallback for SPA routing
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: 'index.html', // This is necessary for single-page app (SPA) behavior
			precompress: false,
			strict: false // This allows dynamic routes without prerendering
		}),

		// Ensure paths work correctly in GitHub Pages subdirectories
		paths: {
			base: process.env.BASE_PATH || ''
		},

		// Alias configuration for better imports
		alias: {
			$lib: './src/lib'
		}
	}
};

export default config;
