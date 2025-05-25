import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
	// Load env variables based on mode
	const env = loadEnv(mode, process.cwd(), '');

	return {
		plugins: [sveltekit()],
		// Ensure the base path is correctly set for both dev and production
		base: env.PUBLIC_BASE_PATH || ''
	};
});
