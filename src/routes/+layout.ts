// Routes layout configuration for SPA mode with enhanced GitHub Pages PR preview support
import { browser } from '$app/environment';
import { getBasePath } from '$lib/utils/path';

// This runs when the page is navigated
export function load() {
	if (browser) {
		// Get the base path for this environment
		const basePath = getBasePath();

		// Log navigation information for debugging
		console.log(`SvelteKit page loaded at ${window.location.pathname} with base: ${basePath}`);

		// Check if we need to fix any relative URLs
		if (basePath) {
			// Wait for DOM to be ready
			setTimeout(() => {
				// Fix image and asset URLs if they don't include base path
				document.querySelectorAll('img, script, link').forEach((el) => {
					const srcAttr = el.tagName === 'LINK' ? 'href' : 'src';
					const src = el.getAttribute(srcAttr);
					if (src && src.startsWith('/') && !src.startsWith(basePath)) {
						el.setAttribute(srcAttr, `${basePath}${src}`);
					}
				});
			}, 100);
		}
	}

	return {
		basePath: browser ? getBasePath() : ''
	};
}

// Tell SvelteKit that all routes can be prerendered
export const prerender = true;

// Tell SvelteKit to treat this as an SPA (no server-side rendering)
export const ssr = false;
