<script>
    import { fly } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';
    import { fileTree, fileMetadata, createFileTreeReference, createFileMetadata, createFolder, createNodeTreeEntry } from './file_tree.js';
    import File from './File.svelte';
    import Folder from './Folder.svelte';
    import NewFolderContext from './action_contexts/NewFolderContext.svelte';
    import NewFileContext from './action_contexts/NewFileContext.svelte';
    import { navStore } from './nav_store.js';
    import { v4 as uuidv4 } from 'uuid';
    import mockData from '../../lib/js/data_json.js';

    function addFile(title) {
        const id = uuidv4();
        $fileMetadata[id] = createFileMetadata({ id, title, objectType: 'function' });
        
        $fileTree.files = [
            ...$fileTree.files,
            createFileTreeReference(id)
        ];

        mockData[id] = createNodeTreeEntry(id);
    }

    function addFolder(title) {
        $fileTree.folders = [
            ...$fileTree.folders,
            createFolder({ title })
        ];
    }
</script>

<div class="side-nav-wrapper">
    <div class="flex w100 nav-action-bar">
        <button on:click={() => navStore.toggleContext(NewFolderContext, addFolder)} class="nav-action-btn"><i class="mi-folder-add" /></button>
        <button on:click={() => navStore.toggleContext(NewFileContext, addFile)} class="nav-action-btn"><i class="mi-document-add" /></button>
        <button class="nav-action-btn"><i class="mi-search" /></button>

        {#if $navStore.isShowingContext}
            <div transition:fly={{ duration: 345, x: -600, opacity: 1, easing: quintOut }} class="absolute nav-context-pane">
                <svelte:component onDoneCallback={$navStore.onDoneCallback} this={$navStore.contextType} />
            </div>
        {/if}
    </div>

    <div class="project-structure-pane">
        {#each $fileTree.folders as folder, i (folder.id)}
            <Folder treePath={`folders.${i}`} bind:fileData={folder} />
        {/each}

        {#each $fileTree.files as file, i (file.id)}
            <File treePath={`files.${i}`} fileData={file} />
        {/each}
    </div>
</div>
    
<style>
    .side-nav-wrapper {
        position: relative;
        width: 24%;
        max-width: 425px;
        height: 100%;
        background: #ddd;
        display: flex;
        flex-direction: column;
        z-index: 0;
    }
    
    .project-structure-pane {
        flex: 1;
        z-index: 1;
    }

    .nav-action-bar {
        z-index: 2;
        padding: 8px 4px;
        background: #ccc;
        position: relative;
    }
    .nav-action-btn {
        margin-right: 8px;
        background: #737373;
        border: none;
        border-radius: 10px;
        color: white;
        font-size: 18pt;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 2px 8px;
        cursor: pointer;
    }
    .nav-action-btn:hover {
        box-shadow: 0 0 8px 1px rgba(0, 0, 0, 0.34);
    }
    .nav-context-pane {
        z-index: 3;
        top: 100%;
        left: 0;
        width: 100%;
        background: rgb(198, 198, 198);
        padding: 10px;
    }
</style>