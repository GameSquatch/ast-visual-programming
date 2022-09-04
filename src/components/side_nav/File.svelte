<script>
    import { editorStore } from '../tabbed_editor/editor_store.js';
    import { fileMetadata } from './file_metadata.js';
    import { navFileDrag } from '../../lib/js/drag_and_drop/drag_start_data_creators.js';
    import { navFileTypePrefix } from '../../lib/js/nav_file_type_prefix.js';
    import NestPadding from './NestPadding.svelte';
    import { contextMenuStore } from '../../store/context_menu_store.js';
    import { requestFocus } from './action_contexts/use_request_focus.js';

    export let fileData;
    export let treePath;
    export let treeLevel = 0;

    let renamingMode = false;
    
    $: metadata = $fileMetadata[fileData.id];
    
    function openNewFile(functionId, functionTitle) {
        editorStore.openTab({ id: functionId, title: functionTitle, fileType: metadata.fileType });
    }

    /**
     * @param {DragEvent} event
     */
    function handleDragStart(event) {
        event.dataTransfer.setData(
            'text/json',
            JSON.stringify(
                navFileDrag({ fileId: fileData.id, treePath, ...metadata })
            )
        );
    }

    function showContextMenu(event) {
        contextMenuStore.update((state) => ({
            showing: true,
            x: event.clientX,
            y: event.clientY,
            menuItems: [
                {
                    title: 'Rename',
                    onSelected: () => renamingMode = true
                },
                {
                    title: 'Delete',
                    onSelected: () => console.log('deleting')
                }
            ]
        }));
    }

    function renameDone(event) {
        $fileMetadata[fileData.id].title = event.target.value;
        renamingMode = false;
    }

    function enterKeyCheck(event) {
        if (event.key !== 'Enter') return;

        event.currentTarget.blur();
    }

    /**
     * @param {HTMLInputElement} inputElem
     */
    function selectText(inputElem) {
        inputElem.select();
    }
</script>

<div class="flex align-center file-title"
    draggable="true"
    on:dragstart={handleDragStart}
    on:click={(_) => openNewFile(fileData.id, metadata.title)}
    on:contextmenu|preventDefault|stopPropagation={showContextMenu}
    >
    <NestPadding {treeLevel} />
    {#if renamingMode}
        <input type="text" use:requestFocus use:selectText on:blur={renameDone} on:keyup={enterKeyCheck} value="{metadata.title}" />
    {:else}
        <span class="{metadata.fileType}">{navFileTypePrefix[metadata.fileType]}</span><span>{metadata.title}</span>
    {/if}
</div>

<style>
    .function {
        color: var(--function-color);
        margin-right: 6px;
        font-weight: bold;
        font-size: 10pt;
    }
</style>
