// hooks.client.js - Client-side hooks for SvelteKit
import { getBasePath } from '$lib/utils/path';

// This handles client-side routing with the correct base path
export function handleError({ error }) {
	console.error('Client-side error:', error);
}

// This hook runs before navigation to ensure paths are properly resolved
export const handleClientLoad = () => {
	// Make sure the base path is loaded and available
	const basePath = getBasePath();
	console.log('App initialized with base path:', basePath || '(root)');
};
