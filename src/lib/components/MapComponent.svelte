<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import maplibre from 'maplibre-gl';
	import 'maplibre-gl/dist/maplibre-gl.css';
	import { searchLocations, type SearchResult, type SearchError } from '$lib/localSearchModule';
	import SearchBar from './SearchBar.svelte';
	import { policeStations } from '$lib/data/policeStations';

	// Container for the map
	let mapContainer: HTMLElement;

	// Store the map instance - initialize as null to prevent undefined errors
	let map: maplibre.Map | null = null;

	// Search state
	let searchResults: SearchResult[] = [];
	let searchError: string | null = null;

	// Police stations state
	let showPoliceStations = false;
	let policeMarkers: maplibre.Marker[] = [];

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

	// Handle police stations toggle from SearchBar
	function handleTogglePoliceStations(event: CustomEvent<{ show: boolean }>) {
		showPoliceStations = event.detail.show;

		if (showPoliceStations) {
			addPoliceStationMarkers();
		} else {
			removePoliceStationMarkers();
		}
	}

	// Add police station markers to the map
	function addPoliceStationMarkers() {
		if (!map) return;

		// Remove existing markers first
		removePoliceStationMarkers();

		// Create a police badge icon element
		policeStations.forEach((station) => {
			// Create a popup with station info
			const popup = new maplibre.Popup({
				offset: 25,
				closeButton: true,
				closeOnClick: true,
				className: 'police-station-popup'
			}).setHTML(`
					<div class="popup-content">
						<h3>${station.name}</h3>
						<p>${station.address}</p>
					</div>
				`);

			// Create marker element
			const el = document.createElement('div');
			el.className = 'police-marker';
			el.innerHTML = `
				<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
					<path d="M12 8v8" />
					<path d="m8.5 14 7-4" />
					<path d="m8.5 10 7 4" />
				</svg>
			`;

			// Create and add the marker with improved options
			const marker = new maplibre.Marker({
				element: el,
				anchor: 'bottom',
				offset: [0, 0],
				pitchAlignment: 'map', // Keep aligned with the map plane
				rotationAlignment: 'map' // Keep aligned with the map
			})
				.setLngLat([station.lon, station.lat])
				.setPopup(popup)
				.addTo(map as maplibre.Map);

			// Store reference to marker for later removal
			policeMarkers.push(marker);
		});
	}

	// Remove police station markers from the map
	function removePoliceStationMarkers() {
		policeMarkers.forEach((marker) => marker.remove());
		policeMarkers = [];
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
	<SearchBar on:search={handleSearch} on:togglePoliceStations={handleTogglePoliceStations} />

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

	/* Police marker styles */
	:global(.police-marker) {
		width: 32px;
		height: 32px;
		cursor: pointer;
		color: #0052a5;
		background-color: white;
		border-radius: 50%;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
		display: flex;
		align-items: center;
		justify-content: center;
		transition: transform 0.2s;
	}

	:global(.police-marker:hover) {
		transform: scale(1.1);
	}

	:global(.police-marker svg) {
		width: 22px;
		height: 22px;
	}

	:global(.police-station-popup) {
		max-width: 300px;
		font-family:
			-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
			'Helvetica Neue', sans-serif;
	}

	:global(.police-station-popup .maplibregl-popup-content) {
		padding: 15px;
		border-radius: 12px;
		box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
	}

	:global(.police-station-popup h3) {
		margin: 0 0 8px 0;
		font-size: 16px;
		color: #0052a5;
	}

	:global(.police-station-popup p) {
		margin: 0;
		color: #444;
		font-size: 14px;
		line-height: 1.4;
	}
</style>
