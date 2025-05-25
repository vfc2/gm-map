// Routes layout configuration for SPA mode
// This runs when the page is navigated
export function load() {
	return {};
}

// Tell SvelteKit that all routes can be prerendered
export const prerender = true;

// Tell SvelteKit to treat this as an SPA (no server-side rendering)
export const ssr = false;
