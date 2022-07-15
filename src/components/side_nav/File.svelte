<script>
    import { editorStore } from '../tabbed_editor/editor_store.js';
    import { fileMetadata } from './file_tree.js';
    import { navFunctionDrag } from '../../lib/js/drag_and_drop/drag_start_data_creators.js';

    export let fileData;

    function openNewFunction(functionId, functionTitle) {
        editorStore.openTab(functionId, functionTitle, 'function');
    }

    $: metadata = $fileMetadata[fileData.id];

    /**
     * 
     * @param {DragEvent} event
     * @param draggedMetadata
     */
    function handleDragStart(event, metadataId) {
        event.dataTransfer.setData('text/json', JSON.stringify(navFunctionDrag({ metadataId })))
    }
</script>

<div class="file-title {metadata.objectType}"
    draggable="true"
    on:dragstart={(event) => handleDragStart(event, fileData.id)}
    on:click={(_) => openNewFunction(fileData.id, metadata.title)}
    >
    <span>{metadata.title}</span>
</div>

<style>
    .file-title {
        padding: 4px 6px;
        cursor: pointer;
        border-left: 5px solid black;
    }
    .file-title:hover {
        background-color: #eee;
    }

    .function {
        border-color: var(--function-color);
    }
</style>
