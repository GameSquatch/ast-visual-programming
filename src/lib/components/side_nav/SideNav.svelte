<script lang="ts">
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
    import { fileDataStore } from '../../lib/js/file_data_store.js';
    import { getDragData } from '../../lib/js/drag_and_drop/drag_and_drop_handlers';
    import { utilDefs } from '../../lib/js/util_definitions.js';
    import { utilDataDrag } from '../../lib/js/drag_and_drop/drag_start_data_creators.js';


    function addFile(title: string, fileType: string) {
        const id = crypto.randomUUID();
        $fileMetadata[id] = createFileMetadata({ title, fileType });

        fileTreeStore.createRootFile({ id });

        fileDataStore.update((tree) => {
            tree[id] = createNodeTreeEntry(id);
            return tree;
        });
    }

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
        fileTreeStore.moveItem({ from: dragObject.dragData.treePath, to: itemLocation, navType: itemLocation });
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
        <button on:click={() => navStore.showContext(NewFolderContext, addFolder)} class="nav-action-btn light-bg-btn">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="svg-icon-size">
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
            </svg>
        </button>
        <button on:click={() => navStore.showContext(NewFileContext, addFile)} class="nav-action-btn light-bg-btn">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="svg-icon-size">
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
        </button>
        <button class="nav-action-btn light-bg-btn">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="svg-icon-size">
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
        </button>

        {#if $navStore.isShowingContext}
            <div
                transition:fly|local={{ duration: 345, x: -600, opacity: 1, easing: quintOut }}
                class="absolute nav-context-pane">
                <svelte:component this={$navStore.contextType} onDoneCallback={$navStore.onDoneCallback} />
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
        <div class="title" on:click={() => navStore.toggleUtilDrawer()}>
            <i class="mi-chevron-{$navStore.utilDrawerIsOpen ? 'down' : 'up'}" /> Utilities
        </div>
        {#if $navStore.utilDrawerIsOpen}
            <div transition:slide|local={{ duration: 300, easing: quintOut }} class="utilities-container">
                {#each Object.keys(utilDefs) as utilDefName (utilDefName)}
                    <div on:dragstart={handleUtilDragStart(utilDefName)} class="utility-row" draggable="true">
                        {utilDefName}
                    </div>
                {/each}
            </div>
        {/if}
    </div>
</div>

<style>
    .side-nav-wrapper {
        grid-area: nav;
        height: 100%;
        background: #eee;
        display: flex;
        flex-direction: column;
        clip-path: inset(0 0 0 0);
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
        max-width: 38px;
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
        clip-path: inset(-4px 0 0 0);
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

    .svg-icon-size {
        width: 22px;
        height: auto;
    }
</style>
