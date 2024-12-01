<script lang="ts">
	import * as ContextMenu from '$lib/components/ui/context-menu';
	import { ClipboardCopy } from 'lucide-svelte';
	import { _ } from 'svelte-i18n';
	import type mapboxgl from 'mapbox-gl';
	import { onMount } from 'svelte';

	export let map: mapboxgl.Map | null;
	let coordinates: mapboxgl.LngLat | undefined;

	onMount(() => {
		if (map) {
			map.on('contextmenu', (e) => {
				e.preventDefault();
				coordinates = e.lngLat;
				console.log(coordinates); // This isn't being triggered
			});

			map.on('click', () => {
				coordinates = undefined;
			});
		}
	});

	function copyCoordinates() {
		if (coordinates) {
			navigator.clipboard.writeText(`${coordinates.lat.toFixed(6)}, ${coordinates.lng.toFixed(6)}`);
		}
	}
</script>

<div class="absolute inset-0 pointer-events-none">
	<ContextMenu.Root>
		<ContextMenu.Trigger class="h-full w-full pointer-events-auto" />
		<ContextMenu.Content>
			{#if coordinates}
				<ContextMenu.Item on:click={copyCoordinates}>
					<ClipboardCopy size="16" class="mr-2" />
					{coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
				</ContextMenu.Item>
			{/if}
		</ContextMenu.Content>
	</ContextMenu.Root>
</div>

<style lang="postcss">
	div :global(.cm-content) {
		@apply z-50;
	}
</style>
