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

    let files = fileData.items.filter((item) => item.type === 'file');
    let folders = fileData.items.filter((item) => item.type === 'folder');

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
    <div class="extra-pad">
        {#each folders as folder (folder.id)}
            <svelte:self fileData={folder} collapser={childCollapser} />
        {/each}

        {#each files as file (file.id)}
            <File fileData={file} />
        {/each}
    </div>
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
        padding-left: 10px;
    }

    .nested-items {
        overflow-y: hidden;
    }
</style>
