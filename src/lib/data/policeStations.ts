// Greater Manchester Police Stations dataset
// Contains police station locations in Greater Manchester with coordinates and addresses

export interface PoliceStationEntry {
	id: string; // Unique identifier
	name: string; // Name of the police station
	address: string; // Full address
	lat: number; // Latitude
	lon: number; // Longitude
}

// Greater Manchester police stations
export const policeStations: PoliceStationEntry[] = [
	{
		id: 'gmp-hq',
		name: 'Greater Manchester Police Headquarters',
		address: 'Central Park, Northampton Road, Manchester M40 5BP',
		lat: 53.499316,
		lon: -2.186986
	},
	{
		id: 'manchester-central',
		name: 'Manchester City Centre Police Station',
		address: 'Bootle Street, Manchester M2 5GU',
		lat: 53.478181,
		lon: -2.248632
	},
	{
		id: 'longsight',
		name: 'Longsight Police Station',
		address: '79 Grindlow St, Manchester M13 9GB',
		lat: 53.459664,
		lon: -2.206653
	},
	{
		id: 'didsbury',
		name: 'Didsbury Police Station',
		address: 'Wilmslow Road, Didsbury, Manchester M20 3BN',
		lat: 53.416286,
		lon: -2.231091
	},
	{
		id: 'salford',
		name: 'Swinton Police Station',
		address: 'Chorley Road, Swinton, Manchester M27 6AZ',
		lat: 53.512136,
		lon: -2.342191
	},
	{
		id: 'rochdale',
		name: 'Rochdale Police Station',
		address: 'The Esplanade, Rochdale OL16 1AG',
		lat: 53.617246,
		lon: -2.155414
	},
	{
		id: 'bolton',
		name: 'Bolton Police Station',
		address: 'Scholey Street, Bolton BL2 1HD',
		lat: 53.58104,
		lon: -2.424397
	},
	{
		id: 'bury',
		name: 'Bury Police Station',
		address: 'Dunster Road, Bury BL9 0RD',
		lat: 53.591364,
		lon: -2.291472
	},
	{
		id: 'wigan',
		name: 'Wigan Police Station',
		address: 'Robin Park Road, Wigan WN5 0UH',
		lat: 53.546026,
		lon: -2.638033
	},
	{
		id: 'oldham',
		name: 'Oldham Police Station',
		address: 'Barn Street, Oldham OL1 1LR',
		lat: 53.539242,
		lon: -2.115673
	},
	{
		id: 'tameside',
		name: 'Ashton-under-Lyne Police Station',
		address: 'Manchester Road, Ashton-under-Lyne OL7 0BQ',
		lat: 53.489307,
		lon: -2.098872
	},
	{
		id: 'stockport',
		name: 'Stockport Police Station',
		address: 'Lee Street, Stockport SK1 3DP',
		lat: 53.412004,
		lon: -2.158425
	}
];
