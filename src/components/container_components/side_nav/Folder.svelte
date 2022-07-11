<script>
    import File from './File.svelte';

    export let fileData;
    export let collapser = "";

    let childCollapser = "";
    let expanded = false;

    $: {
        if (collapser === "collapse") {
            expanded = false;
            childCollapser = "collapse";
            collapser = "";
        }
    }

    function toggleExpanded(_) {
        expanded = !expanded;
    }

    function toggleChildren(_) {
        childCollapser = "collapse";
    }
</script>

<div
    class="file-title"
    on:click={toggleExpanded}
    on:contextmenu|preventDefault={toggleChildren}
>
    <span>&gt; {fileData.title}</span>
    <div class="file-context-menu" />
</div>

<div class="nested-items" class:collapsed={!expanded}>
    {#each fileData.items as file (file.id)}
        <div class="extra-pad">
            {#if file.type === 'file'}
            <File fileData={file} />
            {:else if file.type === 'folder'}
            <svelte:self fileData={file} collapser={childCollapser} />
            {/if}
        </div>
    {/each}
</div>

<style>
    .collapsed {
        display: none;
    }

    .file-title {
        padding: 4px 6px;
        cursor: pointer;
        position: relative;
    }
    .file-title:hover {
        background-color: #eee;
    }

    .extra-pad {
        padding-left: 6px;
    }

    .nested-items {
        overflow-y: hidden;
    }
</style>
