<script lang="ts">
    import * as Card from '$lib/components/ui/card';
    import { Button } from '$lib/components/ui/button';
    import Shortcut from '$lib/components/Shortcut.svelte';
    import CopyCoordinates from '$lib/components/gpx-layer/CopyCoordinates.svelte';
    import { deleteWaypoint } from './GPXLayerPopup';
    import WithUnits from '$lib/components/WithUnits.svelte';
    import { Dot, ExternalLink, Trash2 } from 'lucide-svelte';
    import { Tool, currentTool } from '$lib/stores';
    import { getSymbolKey, symbols } from '$lib/assets/symbols';
    import { _ } from 'svelte-i18n';
    import sanitizeHtml from 'sanitize-html';
    import type { Waypoint } from 'gpx';
    import type { PopupItem } from '$lib/components/MapPopup';
    import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';

    export let waypoint: PopupItem<Waypoint>;

    $: symbolKey = waypoint ? getSymbolKey(waypoint.item.sym) : undefined;

    function sanitize(text: string | undefined): string {
        if (text === undefined) {
            return '';
        }
        return sanitizeHtml(text, {
            allowedTags: ['a', 'br', 'img'],
            allowedAttributes: {
                a: ['href', 'target'],
                img: ['src'],
            },
        }).trim();
    }
</script>

<Card.Root class="border-none shadow-md text-base p-2 max-w-[50dvw]">
    <Card.Header class="p-0">
        <Card.Title class="text-md">
            {#if waypoint.item.link && waypoint.item.link.attributes && waypoint.item.link.attributes.href}
                <a href={waypoint.item.link.attributes.href} target="_blank">
                    {waypoint.item.name ?? waypoint.item.link.attributes.href}
                    <ExternalLink size="12" class="inline-block mb-1.5" />
                </a>
            {:else}
                {waypoint.item.name ?? $_('gpx.waypoint')}
            {/if}
        </Card.Title>
    </Card.Header>
    <Card.Content class="flex flex-col text-sm p-0">
        <div class="flex flex-row items-center text-muted-foreground text-xs whitespace-nowrap">
            {#if symbolKey}
                <span>
                    {#if symbols[symbolKey].icon}
                        <svelte:component
                            this={symbols[symbolKey].icon}
                            size="12"
                            class="inline-block mb-0.5"
                        />
                    {:else}
                        <span class="w-4 inline-block" />
                    {/if}
                    {$_(`gpx.symbol.${symbolKey}`)}
                </span>
                <Dot size="16" />
            {/if}
            {waypoint.item.getLatitude().toFixed(6)}&deg; {waypoint.item
                .getLongitude()
                .toFixed(6)}&deg;
            {#if waypoint.item.ele !== undefined}
                <Dot size="16" />
                <WithUnits value={waypoint.item.ele} type="elevation" />
            {/if}
        </div>
        <ScrollArea class="flex flex-col" viewportClasses="max-h-[30dvh]">
            {#if waypoint.item.desc}
                <span class="whitespace-pre-wrap">{@html sanitize(waypoint.item.desc)}</span>
            {/if}
            {#if waypoint.item.cmt && waypoint.item.cmt !== waypoint.item.desc}
                <span class="whitespace-pre-wrap">{@html sanitize(waypoint.item.cmt)}</span>
            {/if}
        </ScrollArea>
        <div class="mt-2 flex flex-col gap-1">
            <CopyCoordinates coordinates={waypoint.item.attributes} />
            {#if $currentTool === Tool.WAYPOINT}
                <Button
                    class="w-full px-2 py-1 h-8 justify-start"
                    variant="outline"
                    on:click={() => deleteWaypoint(waypoint.fileId, waypoint.item._data.index)}
                >
                    <Trash2 size="16" class="mr-1" />
                    {$_('menu.delete')}
                    <Shortcut shift={true} click={true} />
                </Button>
            {/if}
        </div>
    </Card.Content>
</Card.Root>

<style lang="postcss">
    div :global(a) {
        @apply text-link;
        @apply hover:underline;
    }

    div :global(img) {
        @apply my-0;
        @apply rounded-md;
    }
</style>
