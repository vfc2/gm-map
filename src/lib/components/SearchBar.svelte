<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { getSuggestions, type SearchResult } from '$lib/localSearchModule';

	const dispatch = createEventDispatcher<{
		search: { query: string };
	}>();

	let searchQuery = '';
	let isSearching = false;
	let suggestions: SearchResult[] = [];
	let showSuggestions = false;
	let selectedIndex = -1;
	let inputElement: HTMLInputElement;
	let debounceTimer: ReturnType<typeof setTimeout>;

	// Get suggestions as the user types
	async function handleInput() {
		clearTimeout(debounceTimer);

		// Reset selection when input changes
		selectedIndex = -1;

		// Don't show suggestions for empty queries
		if (!searchQuery.trim()) {
			suggestions = [];
			showSuggestions = false;
			return;
		}

		// Use debounce for suggestions - even with local search this helps UI responsiveness
		debounceTimer = setTimeout(async () => {
			const results = await getSuggestions(searchQuery.trim());

			if (!('message' in results)) {
				suggestions = results;
				showSuggestions = true; // Always show the container (will show "No results" if empty)
			} else {
				suggestions = [];
				showSuggestions = searchQuery.trim().length >= 2; // Only show for queries with 2+ chars
			}
		}, 150); // 150ms debounce (faster since we're now using local search)
	}

	// Handle keyboard navigation
	function handleKeydown(event: KeyboardEvent) {
		if (!showSuggestions || suggestions.length === 0) return;

		switch (event.key) {
			case 'ArrowDown':
				event.preventDefault();
				selectedIndex = (selectedIndex + 1) % suggestions.length;
				break;

			case 'ArrowUp':
				event.preventDefault();
				selectedIndex = selectedIndex <= 0 ? suggestions.length - 1 : selectedIndex - 1;
				break;

			case 'Enter':
				if (selectedIndex >= 0) {
					event.preventDefault();
					selectSuggestion(suggestions[selectedIndex]);
				}
				break;

			case 'Escape':
				event.preventDefault();
				showSuggestions = false;
				break;
		}
	}

	// Handle search form submission
	async function handleSubmit() {
		if (!searchQuery.trim()) return;

		isSearching = true;
		showSuggestions = false;
		dispatch('search', { query: searchQuery.trim() });
		isSearching = false;
	}

	// Handle suggestion selection
	function selectSuggestion(suggestion: SearchResult) {
		searchQuery = suggestion.name;
		showSuggestions = false;

		// Send full display_name to help with identifying the exact place
		dispatch('search', { query: suggestion.display_name });
	}

	// Close suggestions when clicking outside
	function handleClickOutside(event: MouseEvent) {
		if (inputElement && !inputElement.contains(event.target as Node)) {
			showSuggestions = false;
		}
	}

	onMount(() => {
		// Add global click listener
		document.addEventListener('click', handleClickOutside);

		return () => {
			// Clean up
			document.removeEventListener('click', handleClickOutside);
		};
	});
</script>

<div class="search-wrapper">
	<form on:submit|preventDefault={handleSubmit} class="search-container">
		<input
			type="text"
			bind:value={searchQuery}
			bind:this={inputElement}
			on:input={handleInput}
			on:keydown={handleKeydown}
			on:focus={() => (showSuggestions = suggestions.length > 0)}
			placeholder="Search for places"
			aria-label="Search locations"
			class="search-input"
			autocomplete="off"
		/>
		<button
			type="submit"
			disabled={isSearching || !searchQuery.trim()}
			aria-label="Search"
			class="search-button"
		>
			<svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<circle cx="11" cy="11" r="8"></circle>
				<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
			</svg>
		</button>
	</form>

	{#if showSuggestions}
		<div class="suggestions-container" role="listbox" aria-label="Search suggestions">
			{#if suggestions.length > 0}
				{#each suggestions as suggestion, i (suggestion.id)}
					<div
						class="suggestion-item {i === selectedIndex ? 'selected' : ''}"
						on:click={() => selectSuggestion(suggestion)}
						on:keydown={(e) => e.key === 'Enter' && selectSuggestion(suggestion)}
						tabindex="0"
						role="option"
						aria-selected={i === selectedIndex}
					>
						<div class="suggestion-name">{suggestion.name}</div>
						<div class="suggestion-details">{suggestion.display_name}</div>
					</div>
				{/each}
			{:else}
				<div class="no-suggestions">No matches found for "{searchQuery.trim()}"</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.search-wrapper {
		position: absolute;
		top: 20px;
		left: 50%;
		transform: translateX(-50%);
		z-index: 10;
		width: 300px;
		max-width: 90%;
	}

	.search-container {
		width: 100%;
		display: flex;
		background: white;
		border-radius: 24px;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
		position: relative;
	}

	.search-input {
		flex: 1;
		padding: 12px 40px 12px 16px;
		border: none;
		border-radius: 24px;
		font-size: 16px;
	}

	.search-input:focus {
		outline: none;
	}

	.search-button {
		position: absolute;
		right: 5px;
		top: 50%;
		transform: translateY(-50%);
		padding: 8px;
		background: transparent;
		color: #4285f4;
		border: none;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		border-radius: 50%;
		width: 36px;
		height: 36px;
	}

	.search-button:hover {
		background-color: rgba(66, 133, 244, 0.1);
	}

	.search-button:disabled {
		color: #ccc;
		cursor: not-allowed;
	}

	.suggestions-container {
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		background: white;
		border-radius: 0 0 16px 16px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
		max-height: 300px;
		overflow-y: auto;
		z-index: 5;
		margin-top: 8px;
	}

	.suggestion-item {
		padding: 12px 15px;
		cursor: pointer;
		border-bottom: 1px solid #eee;
		transition: background-color 0.15s ease;
	}

	.suggestion-item:last-child {
		border-bottom: none;
		border-radius: 0 0 16px 16px;
	}

	.suggestion-item:hover {
		background-color: #f2f7ff;
	}

	.suggestion-item.selected {
		background-color: #e6f0ff;
		border-left: 3px solid #4285f4;
		padding-left: 12px;
	}

	.suggestion-name {
		font-weight: bold;
		margin-bottom: 4px;
		color: #333;
	}

	.suggestion-details {
		font-size: 12px;
		color: #666;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.no-suggestions {
		padding: 12px 15px;
		color: #666;
		text-align: center;
		font-style: italic;
		font-size: 14px;
		border-bottom: none;
	}
</style>
