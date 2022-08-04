<script>
    import NewFileContext from "./action_contexts/NewFileContext.svelte";
    import NewFolderContext from "./action_contexts/NewFolderContext.svelte";
    import File from "./File.svelte";
    import NestPadding from "./NestPadding.svelte";
    import { fileController } from "../../controllers/file_controller.js";
    import {
        createFolder,
        fileTreeStore,
    } from "./file_tree.js";
    import { navStore } from "./nav_store.js";
    import { getDragData } from "../../lib/js/drag_and_drop/drag_and_drop_handlers";
    import { navFolderDrag } from '../../lib/js/drag_and_drop/drag_start_data_creators.js';

    export let fileData;
    export let treePath;
    export let treeLevel = 0;

    let beingDraggedOver = false;
    let isEmpty = fileData.folders.length + fileData.files.length === 0;
    let expanded = false;


    function toggleExpanded(_) {
        expanded = !expanded;
    }

    function collapseChildren(_) {
        fileData.folders.forEach(function collapse(folder) {
            folder.expanded = false;
            folder.folders.forEach(collapse);
        });
        fileData.folders = fileData.folders;
    }

    function addFile() {
        navStore.showContext(NewFileContext, (title, fileType) => {
            expanded = true;
            fileController.createFile({ treePath, title, fileType });
        });
    }

    function addFolder() {
        navStore.showContext(NewFolderContext, (title) => {
            expanded = true;
            fileTreeStore.addItemAt({ treePath, itemData: createFolder({ title }), navType: 'folders'});
        });
    }

    let dragenterExpandTimer = null;

    function handleDragenter(_) {
        beingDraggedOver = true;

        if (isEmpty) return;

        if (dragenterExpandTimer === null) {
            dragenterExpandTimer = setTimeout(() => (expanded = true), 1400);
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
        expanded = true;

        if (dragenterExpandTimer !== null) {
            clearTimeout(dragenterExpandTimer);
            dragenterExpandTimer = null;
        }

        const dragData = getDragData(event);
        if (dragData.dragType !== "file" && dragData.dragType !== "folder") return;

        fileTreeStore.moveItem({ from: dragData.dragData.treePath, to: treePath, navType: dragData.dragType === 'folder' ? 'folders' : 'files' });
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
    <span>{#if expanded}<i class="mi-remove" />{:else}<i class="mi-add" />{/if}</span>
    <i class="mi-folder" />
    <div
        class="flex-1"
        on:dragenter|preventDefault={handleDragenter}
        on:dragleave|preventDefault={handleDragleave}
    >
        {fileData.title}
    </div>
    <button on:click|stopPropagation={addFile} class="light-bg-btn folder-action-btn btn-hover-transition"
        ><i class="mi-document-add" /></button
    >
    <button on:click|stopPropagation={addFolder} class="light-bg-btn folder-action-btn btn-hover-transition"
        ><i class="mi-folder-add" /></button
    >
</div>

<div class="nested-items" class:collapsed={!expanded}>
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

    .folder-action-btn {
        border: 1px solid #737373;
        border-radius: 5px;
    }
</style>
