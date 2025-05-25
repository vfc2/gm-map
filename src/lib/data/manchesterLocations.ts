// Greater Manchester locations dataset
// This contains key locations in Greater Manchester with coordinates and metadata

export interface LocationEntry {
	id: string; // Unique identifier
	name: string; // Primary name
	display_name: string; // Full display name with hierarchy
	lat: number; // Latitude
	lon: number; // Longitude
	type: string; // Type of location (town, district, suburb, etc.)
	importance: number; // Importance ranking (0-1), higher is more important
	population?: number; // Optional population data where available
	tags?: string[]; // Optional tags for categorization
}

// Greater Manchester locations ordered by importance
export const manchesterLocations: LocationEntry[] = [
	// Major towns and cities
	{
		id: 'manchester',
		name: 'Manchester',
		display_name: 'Manchester, Greater Manchester, England, UK',
		lat: 53.4808,
		lon: -2.2426,
		type: 'city',
		importance: 0.95,
		population: 547627,
		tags: ['city', 'center']
	},
	{
		id: 'salford',
		name: 'Salford',
		display_name: 'Salford, Greater Manchester, England, UK',
		lat: 53.4875,
		lon: -2.2901,
		type: 'city',
		importance: 0.85,
		population: 103886,
		tags: ['city']
	},
	{
		id: 'bolton',
		name: 'Bolton',
		display_name: 'Bolton, Greater Manchester, England, UK',
		lat: 53.5786,
		lon: -2.4299,
		type: 'town',
		importance: 0.82,
		population: 194189,
		tags: ['town']
	},
	{
		id: 'stockport',
		name: 'Stockport',
		display_name: 'Stockport, Greater Manchester, England, UK',
		lat: 53.4086,
		lon: -2.1498,
		type: 'town',
		importance: 0.81,
		population: 136882,
		tags: ['town']
	},
	{
		id: 'oldham',
		name: 'Oldham',
		display_name: 'Oldham, Greater Manchester, England, UK',
		lat: 53.5409,
		lon: -2.1114,
		type: 'town',
		importance: 0.8,
		population: 230823,
		tags: ['town']
	},
	{
		id: 'rochdale',
		name: 'Rochdale',
		display_name: 'Rochdale, Greater Manchester, England, UK',
		lat: 53.6143,
		lon: -2.1548,
		type: 'town',
		importance: 0.79,
		population: 211699,
		tags: ['town']
	},
	{
		id: 'wigan',
		name: 'Wigan',
		display_name: 'Wigan, Greater Manchester, England, UK',
		lat: 53.5432,
		lon: -2.6351,
		type: 'town',
		importance: 0.79,
		population: 326088,
		tags: ['town']
	},
	{
		id: 'bury',
		name: 'Bury',
		display_name: 'Bury, Greater Manchester, England, UK',
		lat: 53.5934,
		lon: -2.2966,
		type: 'town',
		importance: 0.78,
		population: 187474,
		tags: ['town']
	},
	{
		id: 'trafford',
		name: 'Trafford',
		display_name: 'Trafford, Greater Manchester, England, UK',
		lat: 53.4304,
		lon: -2.3588,
		type: 'district',
		importance: 0.77,
		population: 235493,
		tags: ['district']
	},
	{
		id: 'tameside',
		name: 'Tameside',
		display_name: 'Tameside, Greater Manchester, England, UK',
		lat: 53.4857,
		lon: -2.0809,
		type: 'district',
		importance: 0.76,
		population: 226493,
		tags: ['district']
	},

	// Significant areas and districts
	{
		id: 'altrincham',
		name: 'Altrincham',
		display_name: 'Altrincham, Trafford, Greater Manchester, England, UK',
		lat: 53.3868,
		lon: -2.3566,
		type: 'town',
		importance: 0.75,
		population: 52419,
		tags: ['town']
	},
	{
		id: 'sale',
		name: 'Sale',
		display_name: 'Sale, Trafford, Greater Manchester, England, UK',
		lat: 53.4248,
		lon: -2.322,
		type: 'town',
		importance: 0.74,
		population: 55234,
		tags: ['town']
	},
	{
		id: 'ashton-under-lyne',
		name: 'Ashton-under-Lyne',
		display_name: 'Ashton-under-Lyne, Tameside, Greater Manchester, England, UK',
		lat: 53.4894,
		lon: -2.0984,
		type: 'town',
		importance: 0.73,
		population: 45198,
		tags: ['town']
	},
	{
		id: 'heywood',
		name: 'Heywood',
		display_name: 'Heywood, Rochdale, Greater Manchester, England, UK',
		lat: 53.5931,
		lon: -2.2279,
		type: 'town',
		importance: 0.7,
		population: 28205,
		tags: ['town']
	},
	{
		id: 'cheadle',
		name: 'Cheadle',
		display_name: 'Cheadle, Stockport, Greater Manchester, England, UK',
		lat: 53.3936,
		lon: -2.2039,
		type: 'suburb',
		importance: 0.68,
		tags: ['suburb']
	},
	{
		id: 'didsbury',
		name: 'Didsbury',
		display_name: 'Didsbury, Manchester, Greater Manchester, England, UK',
		lat: 53.4108,
		lon: -2.2306,
		type: 'suburb',
		importance: 0.67,
		tags: ['suburb']
	},
	{
		id: 'chorlton',
		name: 'Chorlton',
		display_name: 'Chorlton, Manchester, Greater Manchester, England, UK',
		lat: 53.4407,
		lon: -2.2724,
		type: 'suburb',
		importance: 0.66,
		tags: ['suburb']
	},
	{
		id: 'prestwich',
		name: 'Prestwich',
		display_name: 'Prestwich, Bury, Greater Manchester, England, UK',
		lat: 53.5311,
		lon: -2.2829,
		type: 'suburb',
		importance: 0.65,
		tags: ['suburb']
	},
	{
		id: 'eccles',
		name: 'Eccles',
		display_name: 'Eccles, Salford, Greater Manchester, England, UK',
		lat: 53.4828,
		lon: -2.3345,
		type: 'suburb',
		importance: 0.64,
		tags: ['suburb']
	},
	{
		id: 'leigh',
		name: 'Leigh',
		display_name: 'Leigh, Wigan, Greater Manchester, England, UK',
		lat: 53.4991,
		lon: -2.5202,
		type: 'town',
		importance: 0.63,
		tags: ['town']
	},
	{
		id: 'middleton',
		name: 'Middleton',
		display_name: 'Middleton, Rochdale, Greater Manchester, England, UK',
		lat: 53.5553,
		lon: -2.1995,
		type: 'town',
		importance: 0.62,
		tags: ['town']
	},

	// Notable landmarks and areas
	{
		id: 'manchester-airport',
		name: 'Manchester Airport',
		display_name: 'Manchester Airport, Manchester, Greater Manchester, England, UK',
		lat: 53.3588,
		lon: -2.2727,
		type: 'airport',
		importance: 0.85,
		tags: ['airport', 'transport']
	},
	{
		id: 'trafford-centre',
		name: 'Trafford Centre',
		display_name: 'Trafford Centre, Trafford, Greater Manchester, England, UK',
		lat: 53.4675,
		lon: -2.3481,
		type: 'shopping',
		importance: 0.76,
		tags: ['shopping', 'landmark']
	},
	{
		id: 'etihad-stadium',
		name: 'Etihad Stadium',
		display_name: 'Etihad Stadium, Manchester, Greater Manchester, England, UK',
		lat: 53.4831,
		lon: -2.2004,
		type: 'stadium',
		importance: 0.74,
		tags: ['sports', 'landmark']
	},
	{
		id: 'old-trafford-football',
		name: 'Old Trafford',
		display_name: 'Old Trafford Football Stadium, Trafford, Greater Manchester, England, UK',
		lat: 53.4631,
		lon: -2.2913,
		type: 'stadium',
		importance: 0.75,
		tags: ['sports', 'landmark']
	},
	{
		id: 'media-city',
		name: 'MediaCity',
		display_name: 'MediaCity UK, Salford, Greater Manchester, England, UK',
		lat: 53.4722,
		lon: -2.2969,
		type: 'landmark',
		importance: 0.72,
		tags: ['landmark', 'business']
	},
	{
		id: 'piccadilly-gardens',
		name: 'Piccadilly Gardens',
		display_name: 'Piccadilly Gardens, Manchester, Greater Manchester, England, UK',
		lat: 53.4808,
		lon: -2.2374,
		type: 'landmark',
		importance: 0.68,
		tags: ['landmark', 'park']
	}
	// Note: This is a starter dataset and would be expanded with more locations in a real application
];
