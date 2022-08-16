<script>
    import { fly } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';
    import { slide } from 'svelte/transition';
    import { fileTreeStore, createNodeTreeEntry } from './file_tree.js';
    import { fileMetadata, createFileMetadata } from './file_metadata.js';
    import File from './File.svelte';
    import Folder from './Folder.svelte';
    import NewFolderContext from './action_contexts/NewFolderContext.svelte';
    import NewFileContext from './action_contexts/NewFileContext.svelte';
    import { navStore } from './nav_store.js';
    import { v4 as uuidv4 } from 'uuid';
    import { mockData } from '../../lib/js/data_json.js';
    import { getDragData } from "../../lib/js/drag_and_drop/drag_and_drop_handlers";
    import { utilDefs } from '../../lib/js/util_definitions.js';
    import { utilDataDrag } from '../../lib/js/drag_and_drop/drag_start_data_creators.js';

    /** @type {ContextDoneCallback} */
    function addFile(title, fileType) {
        const id = uuidv4();
        $fileMetadata[id] = createFileMetadata({ title, fileType });

        fileTreeStore.createRootFile({ id });

        mockData.update((tree) => { tree[id] = createNodeTreeEntry(id); return tree; });
    }

    /** @type {ContextDoneCallback} */
    function addFolder(title) {
        fileTreeStore.createRootFolder({ title });
    }

    /** @type {(event: DragEvent) => void} */
    function handleDrop(event) {
        const dragObject = getDragData(event);

        if (event.dataTransfer === null || !['file', 'folder'].includes(dragObject.dragType)) {
            return;
        }

        const itemLocation = dragObject.dragType === 'folder' ? 'folders' : 'files';
        fileTreeStore.moveItem({ from: dragObject.dragData.treePath, to: itemLocation, navType: itemLocation })
    }

    /** @type {(utilDefName: string) => (event: DragEvent) => void} */
    function handleUtilDragStart(utilDefName) {
        return (event) => {
            event.dataTransfer.setData('text/json', JSON.stringify(utilDataDrag({ utilDefName })));
        };
    }
</script>

<div class="side-nav-wrapper">
    <div class="flex w100 nav-action-bar">
        <button on:click={() => navStore.showContext(NewFolderContext, addFolder)} class="nav-action-btn light-bg-btn"><i class="mi-folder-add" /></button>
        <button on:click={() => navStore.showContext(NewFileContext, addFile)} class="nav-action-btn light-bg-btn"><i class="mi-document-add" /></button>
        <button class="nav-action-btn light-bg-btn"><i class="mi-search" /></button>

        {#if $navStore.isShowingContext}
            <div transition:fly|local={{ duration: 345, x: -600, opacity: 1, easing: quintOut }} class="absolute nav-context-pane">
                <svelte:component onDoneCallback={$navStore.onDoneCallback} this={$navStore.contextType} />
            </div>
        {/if}
    </div>

    <div on:drop|stopPropagation={handleDrop} on:dragover|preventDefault={() => {}} class="project-structure-pane">
        {#each $fileTreeStore.folders as folder, i (folder.id)}
            <Folder treePath={`folders.${i}`} bind:fileData={folder} />
        {/each}

        {#each $fileTreeStore.files as file, i (file.id)}
            <File treePath={`files.${i}`} fileData={file} />
        {/each}
    </div>

    <div class="utility-drawer">
        <div class="title" on:click={() => navStore.toggleUtilDrawer()}><i class="mi-chevron-{$navStore.utilDrawerIsOpen ? 'down' : 'up'}"></i> Utilities</div>
        {#if $navStore.utilDrawerIsOpen}
            <div transition:slide|local={{ duration: 300, easing: quintOut }} class="utilities-container">
                {#each Object.keys(utilDefs) as utilDefName (utilDefName)}
                    <div on:dragstart={handleUtilDragStart(utilDefName)} class="utility-row" draggable="true">{utilDefName}</div>
                {/each}
            </div>
        {/if}
    </div>
</div>
    
<style>
    .side-nav-wrapper {
        position: relative;
        width: 24%;
        max-width: 425px;
        height: 100%;
        background: #eee;
        display: flex;
        flex-direction: column;
        z-index: 0;
    }
    
    .project-structure-pane {
        flex: 1;
        z-index: 1;
        padding: 8px 0;
        overflow-y: auto;
    }

    .nav-action-bar {
        z-index: 2;
        padding: 8px;
        position: relative;
        box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.3);
    }
    .nav-action-btn {
        margin-right: 8px;
        font-size: 12pt;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 2px 6px;
    }
    
    .nav-context-pane {
        z-index: 3;
        top: 100%;
        left: 0;
        width: 100%;
        background: rgb(198, 198, 198);
        padding: 10px;
    }

    .utility-drawer .title {
        padding: 6px;
        box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.3);
        cursor: pointer;
    }

    .utilities-container {
        padding: 4px;
    }

    .utility-row {
        padding: 4px 6px;
    }
    .utility-row:hover {
        background-color: #ddd;
        cursor: move;
    }
</style>