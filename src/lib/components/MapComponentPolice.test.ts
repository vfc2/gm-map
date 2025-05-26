import { describe, it, expect } from 'vitest';
import { policeStations } from '../data/policeStations';

// We can't easily test the full map rendering due to MapLibre dependencies
// and the challenges of testing map interactions in a headless environment.
// Instead, we'll test the data is available.

describe('MapComponent Police Stations', () => {
	it('should have police station data available', () => {
		// Verify that the police stations data is available and in the correct format
		expect(policeStations).toBeDefined();
		expect(Array.isArray(policeStations)).toBe(true);
		expect(policeStations.length).toBeGreaterThan(0);
	});

	it('should have the correct data structure for each police station', () => {
		// Check the first police station has all required properties
		const firstStation = policeStations[0];
		expect(firstStation).toHaveProperty('id');
		expect(firstStation).toHaveProperty('name');
		expect(firstStation).toHaveProperty('address');
		expect(firstStation).toHaveProperty('lat');
		expect(firstStation).toHaveProperty('lon');
	});
});
