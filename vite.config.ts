import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';
import fs from 'fs';

export default defineConfig(({ mode }) => {
	// Load env variables based on mode
	const env = loadEnv(mode, process.cwd(), '');
	const basePath = env.PUBLIC_BASE_PATH || '';

	// Create the path-config.js file if it doesn't exist
	if (basePath && !fs.existsSync('./static/path-config.js')) {
		if (!fs.existsSync('./static')) {
			fs.mkdirSync('./static', { recursive: true });
		}
		fs.writeFileSync('./static/path-config.js', `window.APP_BASE_PATH = "${basePath}";`);
		console.log('Created path-config.js with base path:', basePath);
	}

	return {
		plugins: [sveltekit()],
		// Remove base path configuration as SvelteKit handles it
		// base: basePath, 
		build: {
			// Ensure paths in built files include the correct base
			// assetsDir: '_app/immutable', // Let SvelteKit handle this
			emptyOutDir: true,
			// For better debugging
			sourcemap: true
		},
		server: {
			fs: {
				// Allow serving files from the entire workspace
				allow: ['.']
			}
		}
	};
});
