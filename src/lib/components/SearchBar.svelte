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
	<div class="search-bar-group">
		<form
			on:submit|preventDefault={handleSubmit}
			class="search-container {showSuggestions ? 'with-suggestions' : ''}"
			role="search"
			aria-label="Search for places"
		>
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
				role="searchbox"
				aria-autocomplete="list"
				aria-controls="suggestions-listbox"
				aria-activedescendant={selectedIndex >= 0 ? `suggestion-${selectedIndex}` : undefined}
			/>
			<button
				type="submit"
				disabled={isSearching || !searchQuery.trim()}
				aria-label="Search"
				class="search-button-icon"
			>
				<svg
					width="22"
					height="22"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="search-icon"
					aria-hidden="true"
				>
					<circle cx="11" cy="11" r="8" />
					<line x1="21" y1="21" x2="16.65" y2="16.65" />
				</svg>
			</button>
		</form>

		{#if showSuggestions}
			<div
				class="suggestions-container"
				id="suggestions-listbox"
				role="listbox"
				aria-label="Search suggestions"
			>
				{#if suggestions.length > 0}
					{#each suggestions as suggestion, i (suggestion.id)}
						<div
							class="suggestion-item {i === selectedIndex ? 'selected' : ''}"
							on:click={() => selectSuggestion(suggestion)}
							on:keydown={(e) => e.key === 'Enter' && selectSuggestion(suggestion)}
							tabindex="0"
							role="option"
							aria-selected={i === selectedIndex}
							id={`suggestion-${i}`}
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
</div>

<style>
	.search-wrapper {
		position: absolute;
		top: 20px;
		left: 50%;
		transform: translateX(-50%);
		z-index: 10;
		width: 400px;
		max-width: 95vw;
	}

	.search-bar-group {
		position: relative;
		width: 100%;
		box-sizing: border-box;
	}

	.search-container {
		width: 100%;
		display: flex;
		background: white;
		border-radius: 16px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
		align-items: center;
		padding: 2px 8px 2px 8px;
		transition: border-radius 0.15s;
		border-bottom-left-radius: 16px;
		border-bottom-right-radius: 16px;
		box-sizing: border-box;
	}

	.search-container.with-suggestions {
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0;
	}

	.search-input {
		flex: 1;
		padding: 12px 16px;
		border: none;
		border-radius: 16px;
		font-size: 16px;
		background: transparent;
		box-sizing: border-box;
	}

	.search-input:focus {
		outline: none;
	}

	.search-button-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		background: none;
		border: none;
		padding: 8px;
		border-radius: 50%;
		cursor: pointer;
		transition: background 0.15s;
		margin-left: 2px;
	}

	.search-button-icon:disabled {
		cursor: not-allowed;
		background: none;
		color: #ccc;
	}

	.search-icon {
		color: #888;
		transition: color 0.15s;
	}

	.search-button-icon:not(:disabled):hover .search-icon {
		color: #1976d2;
	}

	.suggestions-container {
		position: absolute;
		top: 100%;
		left: 0;
		width: 100%;
		background: white;
		border-radius: 0 0 16px 16px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.18);
		max-height: 320px;
		overflow-y: auto;
		z-index: 5;
		margin-top: 0;
		border-top: 1px solid #f0f0f0;
		box-sizing: border-box;
	}

	.suggestion-item {
		padding: 14px 18px 10px 18px;
		cursor: pointer;
		border-bottom: 1px solid #f3f3f3;
		transition: background-color 0.15s;
		outline: none;
	}

	.suggestion-item:last-child {
		border-bottom: none;
		border-radius: 0 0 16px 16px;
	}

	.suggestion-item:hover {
		background-color: #f2f7ff;
		/* Remove border-left highlight on hover */
	}

	.suggestion-item.selected {
		background-color: #f2f7ff;
		border-left: 3px solid #1976d2;
		padding-left: 15px;
	}

	.suggestion-name {
		font-weight: 600;
		margin-bottom: 2px;
		color: #222;
		font-size: 15px;
	}

	.suggestion-details {
		font-size: 13px;
		color: #666;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.no-suggestions {
		padding: 14px 18px;
		color: #666;
		text-align: center;
		font-style: italic;
		font-size: 15px;
		border-bottom: none;
	}
</style>
