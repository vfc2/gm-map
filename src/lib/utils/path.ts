/**
 * Utilities to handle base path for GitHub Pages deployments
 * This is needed for PR previews and other subpath deployments
 */

/**
 * Get the base path from the environment or runtime configuration
 */
export function getBasePath(): string {
	// First try window.APP_BASE_PATH which is set in path-config.js
	if (typeof window !== 'undefined' && window.APP_BASE_PATH) {
		return window.APP_BASE_PATH;
	}

	// For SSR context, use environment variables
	return import.meta.env.PUBLIC_BASE_PATH || '';
}

/**
 * Create a URL that includes the current base path
 *
 * @param path The relative path to resolve
 * @returns The absolute path including the base path
 */
export function resolveUrl(path: string): string {
	const basePath = getBasePath();
	if (!path.startsWith('/')) {
		path = '/' + path;
	}

	return `${basePath}${path}`;
}

/**
 * Create an asset URL that includes the current base path
 *
 * @param assetPath The relative path of the asset
 * @returns The absolute path to the asset including the base path
 */
export function assetUrl(assetPath: string): string {
	return resolveUrl(assetPath.startsWith('/') ? assetPath : `/${assetPath}`);
}

/**
 * Strip the base path from a full URL
 * Useful for routing
 *
 * @param url The full URL including base path
 * @returns The URL with the base path removed
 */
export function stripBasePath(url: string): string {
	const basePath = getBasePath();
	if (basePath && url.startsWith(basePath)) {
		return url.slice(basePath.length) || '/';
	}
	return url;
}

declare global {
	interface Window {
		APP_BASE_PATH?: string;
	}
}
