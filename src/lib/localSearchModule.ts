import { manchesterLocations, type LocationEntry } from './data/manchesterLocations';

// Types
export type SearchResult = LocationEntry;

export interface SearchError {
	message: string;
}

// Cache for search results to improve performance
const searchCache: Record<string, { timestamp: number; results: SearchResult[] }> = {};
// Cache expiry time: 30 minutes
const CACHE_EXPIRY_MS = 30 * 60 * 1000;

/**
 * Enhanced fuzzy matching function to handle typos and partial matches
 * @param text The text to check
 * @param query The query to match against
 * @returns A score representing the match quality (higher is better)
 */
export function fuzzyMatch(text: string, query: string): number {
	text = text.toLowerCase();
	query = query.toLowerCase();

	// Handle empty inputs
	if (!query) return 0;
	if (!text) return 0;

	// Exact match gets highest score
	if (text === query) return 100;

	// Exact word match gets very high score
	if (new RegExp(`\\b${escapeRegExp(query)}\\b`).test(text)) return 90;

	// Starts with query is next best
	if (text.startsWith(query)) return 85;

	// Parts of text start with query (e.g. matching "man" in "manchester")
	const words = text.split(/\s+/);
	if (words.some((word) => word.startsWith(query))) return 80;

	// Parts of text contain query (stronger than just general inclusion)
	if (words.some((word) => word.includes(query))) return 75;

	// Contains query as word
	if (new RegExp(`\\b${escapeRegExp(query)}\\b`).test(text)) return 70;

	// Contains query somewhere
	if (text.includes(query)) return 60;

	// If query is very short (1-2 chars), require higher match quality with priority for name starts
	if (query.length <= 2) {
		// For short queries, give higher scores for word starts
		if (text.startsWith(query)) return 90;

		// For word starts in multi-word texts
		const words = text.split(/\s+/);
		if (words.some((word) => word.startsWith(query))) return 85;

		// For contains, much lower score to avoid irrelevant matches
		return text.includes(query) ? 40 : 0;
	}

	// Calculate Levenshtein distance for fuzzy matches
	const maxLength = Math.max(text.length, query.length);

	// For longer strings, calculate basic edit distance
	const distance = levenshteinDistance(text, query);

	// Convert distance to similarity score (0-50)
	// Lower distance = higher score, up to 50
	const similarityScore = Math.max(0, 50 - (distance * 10) / maxLength);

	return similarityScore;
}

/**
 * Helper function to escape special characters in regex
 */
export function escapeRegExp(string: string): string {
	return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Calculate the Levenshtein distance between two strings
 * @param str1 First string
 * @param str2 Second string
 * @returns The edit distance between the strings
 */
export function levenshteinDistance(str1: string, str2: string): number {
	const len1 = str1.length;
	const len2 = str2.length;

	// Create a matrix of size (len1+1) x (len2+1)
	const matrix: number[][] = Array(len1 + 1)
		.fill(null)
		.map(() => Array(len2 + 1).fill(null));

	// Fill the first column and the first row
	for (let i = 0; i <= len1; i++) {
		matrix[i][0] = i;
	}

	for (let j = 0; j <= len2; j++) {
		matrix[0][j] = j;
	}

	// Fill the matrix
	for (let i = 1; i <= len1; i++) {
		for (let j = 1; j <= len2; j++) {
			const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;

			matrix[i][j] = Math.min(
				matrix[i - 1][j] + 1, // deletion
				matrix[i][j - 1] + 1, // insertion
				matrix[i - 1][j - 1] + cost // substitution
			);
		}
	}

	return matrix[len1][len2];
}

/**
 * Search for locations based on the query
 * @param query The search query string
 * @returns Promise with search results or error
 */
export async function searchLocations(query: string): Promise<SearchResult[] | SearchError> {
	// Input validation with more descriptive error message
	if (!query) {
		return { message: 'Please enter a search term.' };
	}

	query = query.trim();

	if (query.length < 2) {
		return { message: 'Please enter at least 2 characters to search.' };
	}

	// Check cache first
	const cacheKey = query.toLowerCase();
	const cachedResults = searchCache[cacheKey];

	if (cachedResults && Date.now() - cachedResults.timestamp < CACHE_EXPIRY_MS) {
		console.log('Using cached search for:', query);
		return cachedResults.results;
	}

	try {
		// Calculate match scores for all locations
		const scoredMatches = manchesterLocations.map((location) => {
			// Check primary name with highest weight
			const nameScore = fuzzyMatch(location.name, query);

			// Check display name (but give it less weight)
			const displayNameScore = fuzzyMatch(location.display_name, query) * 0.8;

			// Exact matches get massive boost
			const exactMatchBoost = location.name.toLowerCase() === query.toLowerCase() ? 100 : 0;

			// Boost for major location types
			let typeBoost = 0;
			if (location.type === 'city') typeBoost = 20;
			else if (location.type === 'town') typeBoost = 15;
			else if (location.type === 'district') typeBoost = 10;

			// Check tags if available
			let tagScore = 0;
			if (location.tags) {
				const tagMatches = location.tags.some((tag) => fuzzyMatch(tag, query) > 60);
				tagScore = tagMatches ? 40 : 0;
			}

			// Final score combines all factors, weighted by location importance
			const matchScore =
				(Math.max(nameScore, displayNameScore, tagScore) + exactMatchBoost + typeBoost) *
				(0.5 + location.importance / 2); // Importance boost

			return {
				location,
				score: matchScore
			};
		});

		// Special case for short queries like "St"
		const isShortQuery = query.trim().length <= 2;

		// First, check for direct name matches with word starts (highest priority)
		// For short queries, only consider matches at the start of words
		const nameStartMatches = scoredMatches.filter((item) => {
			const name = item.location.name.toLowerCase();
			const q = query.toLowerCase();

			// Check if any word in the name starts with the query
			return name.split(/\s+/).some((word) => word.startsWith(q));
		});

		// Second level: check for locations where name directly starts with query
		const nameContainsMatches = !isShortQuery
			? scoredMatches.filter((item) => {
					const name = item.location.name.toLowerCase();
					const q = query.toLowerCase();
					return name.includes(q);
				})
			: [];

		// Use priority matching for short queries to avoid irrelevant results
		const directNameMatches = nameStartMatches.length > 0 ? nameStartMatches : nameContainsMatches;

		// If we have direct name matches, only use those
		const filteredMatches =
			directNameMatches.length > 0
				? directNameMatches
				: scoredMatches.filter((item) => {
						// For searches with no direct matches, use strict score-based filtering
						const queryLength = query.trim().length;

						// Even stricter thresholds especially for short queries
						if (queryLength <= 2) {
							return item.score > 80; // Extremely strict for short queries
						} else if (queryLength <= 4) {
							return item.score > 60; // Very strict for medium queries
						} else {
							return item.score > 40; // Stricter threshold for longer queries
						}
					});

		// Sort the filtered matches with special handling for short queries
		const results = filteredMatches
			.sort((a, b) => {
				const q = query.toLowerCase();
				const nameA = a.location.name.toLowerCase();
				const nameB = b.location.name.toLowerCase();

				// For short queries (1-2 chars), prioritize name starts above all else
				if (q.length <= 2) {
					// Check if names start with query
					const aStartsWithQuery = nameA.startsWith(q);
					const bStartsWithQuery = nameB.startsWith(q);

					if (aStartsWithQuery && !bStartsWithQuery) return -1;
					if (bStartsWithQuery && !aStartsWithQuery) return 1;

					// Check if any word in names starts with query
					const aWordStartsWithQuery = nameA.split(/\s+/).some((word) => word.startsWith(q));
					const bWordStartsWithQuery = nameB.split(/\s+/).some((word) => word.startsWith(q));

					if (aWordStartsWithQuery && !bWordStartsWithQuery) return -1;
					if (bWordStartsWithQuery && !aWordStartsWithQuery) return 1;
				}

				// If the above didn't determine order, fallback to score
				if (b.score !== a.score) {
					return b.score - a.score;
				}

				// Last fallback to importance
				return b.location.importance - a.location.importance;
			})
			.map((item) => item.location) // Return just the location data
			.slice(0, 5); // Limit to top 5 results

		// Cache the results
		searchCache[cacheKey] = {
			timestamp: Date.now(),
			results
		};

		return results;
	} catch (error) {
		console.error('Local search error:', error);
		return { message: 'An error occurred during search. Please try again.' };
	}
}

/**
 * Get autocomplete suggestions for a search query
 * @param query The partial query string to get suggestions for
 * @returns Promise with search suggestions or error
 */
export async function getSuggestions(query: string): Promise<SearchResult[] | SearchError> {
	// For local search, we can just use the same algorithm as the full search
	return searchLocations(query);
}
