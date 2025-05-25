import '@testing-library/jest-dom';
import { vi } from 'vitest';
import * as svelte from 'svelte';

// Mock necessary browser APIs
Object.defineProperty(window, 'matchMedia', {
	writable: true,
	value: vi.fn().mockImplementation((query) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: vi.fn(),
		removeListener: vi.fn(),
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn()
	}))
});

// Mock maplibre-gl since it requires canvas
vi.mock('maplibre-gl', () => ({
	default: {
		Map: vi.fn(() => ({
			remove: vi.fn(),
			on: vi.fn(),
			addControl: vi.fn(),
			flyTo: vi.fn()
		})),
		NavigationControl: vi.fn(),
		ScaleControl: vi.fn(),
		LngLatBounds: vi.fn()
	}
}));
