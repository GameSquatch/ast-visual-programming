<script>
    import NewFileContext from './action_contexts/NewFileContext.svelte';
    import NewFolderContext from './action_contexts/NewFolderContext.svelte';
    import File from './File.svelte';
    import { navStore } from './nav_store.js';
    import { v4 as uuidv4 } from 'uuid';
    import mockData from '../../../lib/js/data_json.js';

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

    $: files = fileData.items.filter((item) => item.type === 'file');
    $: folders = fileData.items.filter((item) => item.type === 'folder');

    function toggleExpanded(_) {
        if (fileData.items.length === 0) return;

        expanded = !expanded;
    }

    function toggleChildren(_) {
        childCollapser = "collapse";
    }

    function addFile() {
        navStore.toggleContext(NewFileContext, (title) => {
            const id = uuidv4();
            expanded = true;
            fileData.items = [
                ...fileData.items,
                {
                    id,
                    title,
                    type: 'file'
                }
            ];

            mockData[id] = {
            main: {
                info: {
                    variables: {},
                    parameters: {}
                },
                body: []
            }
        };
        });
    }

    function addFolder() {
        navStore.toggleContext(NewFolderContext, (title) => {
            expanded = true;
            fileData.items = [
                ...fileData.items,
                {
                    id: uuidv4(),
                    title,
                    type: 'folder',
                    items: []
                }
            ];
        });
    }
</script>

<div
    class="file-title-bar"
    on:click={toggleExpanded}
    on:contextmenu|preventDefault={toggleChildren}
>
    <span>{expanded ? '+' : '>'}</span>
    <div class="flex-1 file-title">{fileData.title}</div>
    <button on:click|stopPropagation={addFile} class="folder-action-btn"><i class="mi-document-add" /></button>
    <button on:click|stopPropagation={addFolder} class="folder-action-btn"><i class="mi-folder-add" /></button>

    <!-- <div class="file-context-menu" /> -->
</div>

<div class="nested-items" class:collapsed={!expanded}>
    <div class="extra-pad">
        {#each folders as folder (folder.id)}
            <svelte:self bind:fileData={folder} collapser={childCollapser} />
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

    .file-title-bar {
        display: flex;
        padding: 4px 6px;
        cursor: pointer;
        position: relative;
    }
    .file-title-bar:hover {
        background-color: #eee;
    }

    .file-title {
        margin-left: 6px;
    }

    .extra-pad {
        padding-left: 10px;
    }

    .nested-items {
        overflow-y: hidden;
    }
</style>
