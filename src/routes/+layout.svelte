<script>
	import '../app.css';

	// Get data from +layout.ts load function
	export let data;
</script>

<!-- Debug info for base path (hidden in production) -->
{#if import.meta.env.DEV}
	<div
		style="position: fixed; bottom: 0; right: 0; background: #333; color: #fff; padding: 5px; font-size: 12px; z-index: 9999;"
	>
		Base Path: {data.basePath || '(root)'}
	</div>
{/if}

<slot />
