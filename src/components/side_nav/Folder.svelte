<script>
    import NewFileContext from "./action_contexts/NewFileContext.svelte";
    import NewFolderContext from "./action_contexts/NewFolderContext.svelte";
    import File from "./File.svelte";
    import {
        fileMetadata,
        createFolder,
        createFileTreeReference,
        createFileMetadata,
        createNodeTreeEntry,
        fileTree,
    } from "./file_tree.js";
    import { navStore } from "./nav_store.js";
    import { v4 as uuidv4 } from "uuid";
    import mockData from "../../lib/js/data_json.js";
    import { getDragData } from "../../lib/js/drag_and_drop/drag_and_drop_handlers";

    export let fileData;
    export let treePath;

    let beingDraggedOver = false;


    function toggleExpanded(_) {
        if (fileData.files.length === 0 && fileData.folders.length === 0)
            return;

        fileData.expanded = !fileData.expanded;
    }

    function toggleChildren(_) {
        fileData.folders.forEach(function collapse(folder) {
            folder.expanded = false;
            folder.folders.forEach(collapse);
        });
        fileData.folders = fileData.folders;
    }

    function addFile() {
        navStore.toggleContext(NewFileContext, (title) => {
            const id = uuidv4();
            fileData.expanded = true;
            $fileMetadata[id] = createFileMetadata({
                id,
                title,
                objectType: "function",
            });

            fileData.files = [...fileData.files, createFileTreeReference(id)];

            mockData[id] = createNodeTreeEntry(id);
        });
    }

    function addFolder() {
        navStore.toggleContext(NewFolderContext, (title) => {
            fileData.expanded = true;
            fileData.folders = [...fileData.folders, createFolder({ title })];
        });
    }

    let dragenterExpandTimer = null;

    function handleDragenter(_) {
        beingDraggedOver = true;

        if (fileData.folders.length === 0 && fileData.files.length === 0) return;

        if (dragenterExpandTimer === null) {
            dragenterExpandTimer = setTimeout(() => (fileData.expanded = true), 1400);
        } else {
            clearTimeout(dragenterExpandTimer);
            dragenterExpandTimer = null;
        }

    }

    function handleDragleave(_) {
        beingDraggedOver = false;

        if (fileData.folders.length === 0 && fileData.files.length === 0) return;

        if (dragenterExpandTimer !== null) {
            clearTimeout(dragenterExpandTimer);
            dragenterExpandTimer = null;
        }
    }

    /**
     * @param {DragEvent} event
     */
    function handleDrop(event) {
        beingDraggedOver = false;
        fileData.expanded = true;

        if (dragenterExpandTimer !== null) {
            clearTimeout(dragenterExpandTimer);
            dragenterExpandTimer = null;
        }

        const dragData = getDragData(event);
        if (dragData.dragType !== "function") return;

        //console.log(dragData);
        fileTree.moveFile({ from: dragData.dragData.treePath, to: treePath });
    }
</script>

<div
    class="file-title-bar"
    class:dragover={beingDraggedOver}
    on:click={toggleExpanded}
    on:contextmenu|preventDefault={toggleChildren}
    on:dragover|preventDefault={() => {}}
    on:drop|preventDefault|stopPropagation={(event) => handleDrop(event)}
>
    {#if fileData.files.length || fileData.folders.length}
        <span>{#if fileData.expanded}<i class="mi-remove" />{:else}<i class="mi-add" />{/if}</span>
    {/if}
    <i class="mi-folder" />
    <div
        class="flex-1 file-title"
        on:dragenter|preventDefault={handleDragenter}
        on:dragleave|preventDefault={handleDragleave}
    >
        {fileData.title}
    </div>
    <button on:click|stopPropagation={addFile} class="folder-action-btn"
        ><i class="mi-document-add" /></button
    >
    <button on:click|stopPropagation={addFolder} class="folder-action-btn"
        ><i class="mi-folder-add" /></button
    >

    <!-- <div class="file-context-menu" /> -->
</div>

<div class="nested-items" class:collapsed={!fileData.expanded}>
    <div class="extra-pad">
        {#each fileData.folders as folder, i (folder.id)}
            <svelte:self
                bind:fileData={folder}
                treePath={`${treePath}.folders.${i}`}
            />
        {/each}

        {#each fileData.files as file, i (file.id)}
            <File fileData={file} treePath={`${treePath}.files.${i}`} />
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
        align-items: center;
    }
    .file-title-bar:hover {
        background-color: #eee;
    }
    .file-title-bar.dragover {
        background-color: #eee;
    }

    .file-title {
        margin-left: 6px;
    }

    .extra-pad {
        padding-left: 18px;
    }

    .nested-items {
        overflow-y: hidden;
    }
</style>
