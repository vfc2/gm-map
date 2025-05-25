import { describe, it, expect } from 'vitest';
import { fuzzyMatch, levenshteinDistance, searchLocations } from './localSearchModule';

// Fuzzy match tests

describe('fuzzyMatch', () => {
	it('returns 100 for exact match', () => {
		expect(fuzzyMatch('Stockport', 'Stockport')).toBe(100);
	});
	it('returns high score for startsWith', () => {
		expect(fuzzyMatch('Stockport', 'Stock')).toBeGreaterThan(80);
	});
	it('returns low score for unrelated', () => {
		expect(fuzzyMatch('Manchester', 'Stockport')).toBeLessThan(50);
	});
	it('handles short queries with priority', () => {
		expect(fuzzyMatch('Stockport', 'St')).toBeGreaterThan(80);
	});
});

describe('levenshteinDistance', () => {
	it('returns 0 for identical strings', () => {
		expect(levenshteinDistance('abc', 'abc')).toBe(0);
	});
	it('returns correct distance for simple cases', () => {
		expect(levenshteinDistance('kitten', 'sitting')).toBe(3);
		expect(levenshteinDistance('flaw', 'lawn')).toBe(2);
	});
});

describe('searchLocations', () => {
	it('returns error for empty query', async () => {
		const result = await searchLocations('');
		expect(result).toHaveProperty('message');
	});
	it('returns error for short query', async () => {
		const result = await searchLocations('a');
		expect(result).toHaveProperty('message');
	});
	it('returns array for a valid query', async () => {
		const result = await searchLocations('Man');
		expect(Array.isArray(result)).toBe(true);
		if (Array.isArray(result) && result.length > 0) {
			expect(result[0]).toHaveProperty('name');
			expect(result[0]).toHaveProperty('display_name');
		}
	});
});
