<script>
    import NewFileContext from "./action_contexts/NewFileContext.svelte";
    import NewFolderContext from "./action_contexts/NewFolderContext.svelte";
    import File from "./File.svelte";
    import NestPadding from "./NestPadding.svelte";
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
    import { navFolderDrag } from '../../lib/js/drag_and_drop/drag_start_data_creators.js';

    export let fileData;
    export let treePath;
    export let treeLevel = 0;

    let beingDraggedOver = false;
    let isEmpty = fileData.folders.length + fileData.files.length === 0;


    function toggleExpanded(_) {
        fileData.expanded = !fileData.expanded;
    }

    function collapseChildren(_) {
        fileData.folders.forEach(function collapse(folder) {
            folder.expanded = false;
            folder.folders.forEach(collapse);
        });
        fileData.folders = fileData.folders;
    }

    function addFile() {
        navStore.toggleContext(NewFileContext, (title, fileType) => {
            const id = uuidv4();
            fileData.expanded = true;
            $fileMetadata[id] = createFileMetadata({
                title,
                fileType
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

        if (isEmpty) return;

        if (dragenterExpandTimer === null) {
            dragenterExpandTimer = setTimeout(() => (fileData.expanded = true), 1400);
        } else {
            clearTimeout(dragenterExpandTimer);
            dragenterExpandTimer = null;
        }

    }

    function handleDragleave(_) {
        beingDraggedOver = false;

        if (isEmpty) return;

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
        if (dragData.dragType !== "function" && dragData.dragType !== "folder") return;

        fileTree.moveItem({ from: dragData.dragData.treePath, to: treePath, navType: dragData.dragType === 'folder' ? 'folders' : 'files' });
    }

    function handleDragstart(event) {
        event.dataTransfer.setData(
            'text/json',
            JSON.stringify(
                navFolderDrag({ id: fileData.id, treePath })
            )
        );
    }
</script>

<div
    class="file-title folder-row"
    class:dragover={beingDraggedOver}
    on:click={toggleExpanded}
    on:contextmenu|preventDefault={collapseChildren}
    on:dragover|preventDefault={() => {}}
    on:drop|stopPropagation={(event) => handleDrop(event)}
    on:dragstart={handleDragstart}
    draggable="true"
>
    <NestPadding {treeLevel} />
    <span>{#if fileData.expanded}<i class="mi-remove" />{:else}<i class="mi-add" />{/if}</span>
    <i class="mi-folder" />
    <div
        class="flex-1"
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
</div>

<div class="nested-items" class:collapsed={!fileData.expanded}>
        {#each fileData.folders as folder, i (folder.id)}
            <svelte:self
                bind:fileData={folder}
                treeLevel={treeLevel + 1}
                treePath={`${treePath}.folders.${i}`}
            />
        {/each}

        {#each fileData.files as file, i (file.id)}
            <File fileData={file} treeLevel={treeLevel + 1} treePath={`${treePath}.files.${i}`} />
        {/each}
</div>

<style>
    .collapsed {
        display: none;
    }

    .folder-row {
        display: flex;
        cursor: pointer;
        position: relative;
        align-items: center;
    }
    .folder-row.dragover {
        background-color: #eee;
    }

    .nested-items {
        overflow-y: hidden;
    }

    .mi-folder {
        margin-right: 6px;
    }

    .mi-remove, .mi-add {
        font-size: 10pt;
    }
</style>
