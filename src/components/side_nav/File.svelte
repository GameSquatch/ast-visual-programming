<script>
    import { editorStore } from '../tabbed_editor/editor_store.js';
    import { fileMetadata } from './file_tree.js';
    import { navFunctionDrag } from '../../lib/js/drag_and_drop/drag_start_data_creators.js';
    import NestPadding from './NestPadding.svelte';

    export let fileData;
    export let treePath;
    export let treeLevel = 0;

    function openNewFunction(functionId, functionTitle) {
        editorStore.openTab(functionId, functionTitle, 'function');
    }

    $: metadata = $fileMetadata[fileData.id];

    /**
     * 
     * @param {DragEvent} event
     * @param draggedMetadata
     */
    function handleDragStart(event) {
        event.dataTransfer.setData(
            'text/json',
            JSON.stringify(
                navFunctionDrag({ metadataId: fileData.id, treePath, ...metadata })
            )
        );
    }
</script>

<div class="flex align-center file-title {metadata.objectType}"
    draggable="true"
    on:dragstart={handleDragStart}
    on:click={(_) => openNewFunction(fileData.id, metadata.title)}
    >
    <NestPadding {treeLevel} />
    <span>{metadata.title}</span>
</div>

<style>
    /* .function {
        border-color: var(--function-color);
    } */
</style>
