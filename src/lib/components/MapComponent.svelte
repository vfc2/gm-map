<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import maplibre from 'maplibre-gl';
	import 'maplibre-gl/dist/maplibre-gl.css';
	import { searchLocations, type SearchResult, type SearchError } from '$lib/localSearchModule';
	import SearchBar from './SearchBar.svelte';

	// Container for the map
	let mapContainer: HTMLElement;

	// Store the map instance - initialize as null to prevent undefined errors
	let map: maplibre.Map | null = null;

	// Search state
	let searchResults: SearchResult[] = [];
	let searchError: string | null = null;

	// Handle search event from SearchBar
	async function handleSearch(event: CustomEvent<{ query: string }>) {
		// Check if map is initialized
		if (!map) {
			searchError = 'Map is not initialized yet. Please wait and try again.';
			return;
		}

		searchError = null;

		// Now using local search service instead of API
		let results: SearchResult[] | SearchError;

		// Check if this is a direct selection or a new search
		if (event.detail.query.includes(',')) {
			// Direct selection - extract the name part from display_name
			const placeName = event.detail.query.split(',')[0].trim();
			results = await searchLocations(placeName);
		} else {
			// Regular search
			results = await searchLocations(event.detail.query);
		}

		if ('message' in results) {
			searchError = results.message;
			return;
		}

		searchResults = results;

		if (searchResults.length > 0) {
			// Center and zoom to the first result
			const firstResult = searchResults[0];

			// Fly to the location with appropriate zoom level based on location type
			let zoomLevel = 15; // default

			// Set zoom based on location type
			if (firstResult.type === 'city') zoomLevel = 12;
			else if (firstResult.type === 'town') zoomLevel = 13;
			else if (firstResult.type === 'district') zoomLevel = 13;
			else if (firstResult.type === 'suburb') zoomLevel = 14;
			else if (firstResult.type === 'landmark') zoomLevel = 16;

			// Make sure map is still valid before trying to use it
			if (map) {
				try {
					map.flyTo({
						center: [firstResult.lon, firstResult.lat],
						zoom: zoomLevel,
						essential: true // this animation is considered essential for the user experience
					});
				} catch (err) {
					console.error('Error flying to location:', err);
					searchError = 'Error navigating to location. Please try again.';
				}
			}

			// Show success message in console only
			console.log(`Found location: ${firstResult.name} (${firstResult.type})`);
		} else {
			searchError = 'No matching locations found in Greater Manchester.';
		}
	}

	onMount(() => {
		if (mapContainer) {
			try {
				// Define Greater Manchester bounds
				const greaterManchesterBounds = new maplibre.LngLatBounds(
					[-2.7858, 53.3381], // Southwest corner [lng, lat]
					[-1.9094, 53.6717] // Northeast corner [lng, lat]
				);

				// Create a simpler map style that's less likely to cause issues
				const simpleMapStyle = {
					version: 8 as const, // Use const assertion
					sources: {
						'osm-tiles': {
							type: 'raster',
							tiles: ['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'],
							tileSize: 256,
							attribution:
								'© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
						}
					},
					layers: [
						{
							id: 'osm-tiles',
							type: 'raster',
							source: 'osm-tiles',
							minzoom: 0,
							maxzoom: 19
						}
					]
				};

				// Initialize the map with a style that includes roads and POIs
				map = new maplibre.Map({
					container: mapContainer,
					style: simpleMapStyle as maplibre.StyleSpecification,
					center: [-2.15, 53.41], // Starting position [lng, lat] - Stockport, UK
					zoom: 10, // Starting zoom - good view of Greater Manchester area
					maxBounds: greaterManchesterBounds, // Restrict viewport to Greater Manchester
					maxPitch: 85, // Allow more tilted view
					attributionControl: { compact: false } // Show attribution
				});

				// Handle style loading error and fallback to a simpler style
				map.on('error', (e: { error?: { message?: string } }) => {
					console.error('Map error:', e);

					// If the error is related to style loading, fallback to basic style
					if (e.error && e.error.message && e.error.message.includes('style') && map) {
						console.log('Falling back to basic style');
						map.setStyle('https://demotiles.maplibre.org/style.json');
					}
				});

				// Add navigation control (zoom in/out)
				map.addControl(new maplibre.NavigationControl(), 'top-right');

				// Add scale control
				map.addControl(
					new maplibre.ScaleControl({
						maxWidth: 100,
						unit: 'metric'
					}),
					'bottom-left'
				);
			} catch (error) {
				console.error('Error initializing map:', error);
			}
		}
	});

	onDestroy(() => {
		// Clean up map resources when component is destroyed
		if (map) {
			try {
				map.remove();
			} catch (err) {
				console.error('Error removing map:', err);
			}
			map = null;
		}
	});
</script>

<div class="map-wrapper">
	<SearchBar on:search={handleSearch} />

	{#if searchError}
		<div class="search-error">
			{searchError}
		</div>
	{/if}

	<div class="map-container" bind:this={mapContainer}></div>
</div>

<style>
	.map-wrapper {
		position: relative;
		width: 100%;
		height: 100vh;
	}

	.map-container {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
	}

	.search-error {
		position: absolute;
		top: 70px;
		left: 50%;
		transform: translateX(-50%);
		z-index: 2;
		background: rgba(255, 59, 48, 0.9);
		color: white;
		padding: 10px 20px;
		border-radius: 4px;
		font-size: 14px;
		max-width: 80%;
		text-align: center;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
		animation: fadeIn 0.3s ease-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateX(-50%) translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateX(-50%) translateY(0);
		}
	}
</style>
