// PR Preview Helper for GitHub Pages
// This file improves SPA routing and asset paths for GitHub Pages PR preview deployments

(function () {
	// Custom health check for debugging
	const healthcheck = {
		loadedAt: new Date().toISOString(),
		location: window.location.href,
		pathname: window.location.pathname,
		basePath: window.APP_BASE_PATH || '(not set)',
		referrer: document.referrer || '(none)',
		userAgent: navigator.userAgent
	};

	// Log health check info to console for debugging
	console.log('PR Preview Helper initializing with config:', healthcheck);

	// Function to detect if we're in a GitHub Pages PR preview environment
	function isGitHubPagesPRPreview() {
		const path = window.location.pathname;
		return path.includes('/pr-preview/pr-');
	}

	// Extract the PR number from the URL path (e.g., /org/repo/pr-preview/pr-123/)
	function extractPRNumber() {
		if (!isGitHubPagesPRPreview()) return null;

		const match = window.location.pathname.match(/\/pr-preview\/pr-(\d+)/);
		return match ? match[1] : null;
	}

	// Function to handle SPA routing for GitHub Pages
	function setupGitHubPagesRouting() {
		// Load the PR preview CSS if needed
		if (isGitHubPagesPRPreview()) {
			// Add PR preview indicator
			const prNumber = extractPRNumber();
			if (prNumber) {
				document.body.setAttribute('data-preview-info', `PR #${prNumber} Preview`);
			}

			// Link the preview CSS
			if (!document.querySelector('link[href*="pr-preview.css"]')) {
				const cssLink = document.createElement('link');
				cssLink.rel = 'stylesheet';
				cssLink.href = `${window.APP_BASE_PATH || ''}/pr-preview.css`;
				document.head.appendChild(cssLink);
			}

			console.log('GitHub Pages PR preview detected, setting up SPA routing');

			// Add event listener to handle internal navigation
			document.addEventListener(
				'click',
				function (event) {
					// Only process links
					const link = event.target.closest('a');
					if (!link) return;

					// Only process internal links
					const href = link.getAttribute('href');
					if (!href || href.startsWith('http') || href.startsWith('//')) return;

					// Add base path if needed
					if (window.APP_BASE_PATH && !href.startsWith(window.APP_BASE_PATH)) {
						link.setAttribute(
							'href',
							window.APP_BASE_PATH + (href.startsWith('/') ? href : '/' + href)
						);
						console.log('Rewrote link to:', link.getAttribute('href'));
					}
				},
				{ capture: true }
			);

			// Create debug panel
			const debugPanel = document.createElement('div');
			debugPanel.className = 'pr-preview-debug';
			debugPanel.innerHTML = `
        <div>PR Preview Debug</div>
        <div>Base Path: ${window.APP_BASE_PATH || '(none)'}</div>
        <div>PR#: ${prNumber || 'unknown'}</div>
        <div>Path: ${window.location.pathname}</div>
        <button onclick="this.parentNode.style.display='none'">Close</button>
      `;
			document.body.appendChild(debugPanel);
		}
	}

	// Fix script loading errors by rewriting src attributes
	function fixAssetPaths() {
		if (!window.APP_BASE_PATH) return;

		const basePath = window.APP_BASE_PATH;

		// Create a MutationObserver to catch dynamically added elements
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.addedNodes) {
					mutation.addedNodes.forEach((node) => {
						if (node.tagName === 'SCRIPT' || node.tagName === 'LINK' || node.tagName === 'IMG') {
							fixElementSrc(node);
						}
					});
				}
			});
		});

		// Fix existing elements
		document.querySelectorAll('script, link, img').forEach(fixElementSrc);

		// Start observing document for added nodes
		observer.observe(document, { childList: true, subtree: true });

		function fixElementSrc(el) {
			if (!el || !el.getAttribute) return;

			const srcAttr = el.tagName === 'LINK' ? 'href' : 'src';
			const src = el.getAttribute(srcAttr);

			if (src && src.startsWith('/') && !src.startsWith(basePath)) {
				console.log(`Fixing ${el.tagName} ${srcAttr}:`, src, '->', `${basePath}${src}`);
				el.setAttribute(srcAttr, `${basePath}${src}`);
			}
		}
	}

	// Call setup functions when the DOM is ready
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', () => {
			setupGitHubPagesRouting();
			fixAssetPaths();
		});
	} else {
		setupGitHubPagesRouting();
		fixAssetPaths();
	}

	// Expose health check and utilities for debugging
	window.__sveltekit_health = healthcheck;
	window.__prPreviewHelper = {
		isGitHubPagesPRPreview,
		extractPRNumber,
		healthcheck
	};
})();
