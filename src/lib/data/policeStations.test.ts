import { describe, it, expect } from 'vitest';
import { policeStations } from './policeStations';

describe('policeStations', () => {
	it('should include at least one police station', () => {
		expect(policeStations.length).toBeGreaterThan(0);
	});

	it('should have all required fields for each police station', () => {
		policeStations.forEach((station) => {
			expect(station).toHaveProperty('id');
			expect(station).toHaveProperty('name');
			expect(station).toHaveProperty('address');
			expect(station).toHaveProperty('lat');
			expect(station).toHaveProperty('lon');

			expect(typeof station.id).toBe('string');
			expect(typeof station.name).toBe('string');
			expect(typeof station.address).toBe('string');
			expect(typeof station.lat).toBe('number');
			expect(typeof station.lon).toBe('number');
		});
	});

	it('should have valid latitudes and longitudes within Greater Manchester range', () => {
		// Greater Manchester approximate bounding box
		const MIN_LAT = 53.3381;
		const MAX_LAT = 53.6717;
		const MIN_LON = -2.7858;
		const MAX_LON = -1.9094;

		policeStations.forEach((station) => {
			expect(station.lat).toBeGreaterThanOrEqual(MIN_LAT);
			expect(station.lat).toBeLessThanOrEqual(MAX_LAT);
			expect(station.lon).toBeGreaterThanOrEqual(MIN_LON);
			expect(station.lon).toBeLessThanOrEqual(MAX_LON);
		});
	});
});
