// hooks.client.js - Client-side hooks for SvelteKit

// This handles client-side routing with the correct base path
export function handleError({ error }) {
	console.error('Client-side error:', error);
}
