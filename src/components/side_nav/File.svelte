<script>
    import { editorStore } from '../tabbed_editor/editor_store.js';
    import { fileMetadata } from './file_metadata.js';
    import { navFileDrag } from '../../lib/js/drag_and_drop/drag_start_data_creators.js';
    import { navFileTypePrefix } from '../../lib/js/nav_file_type_prefix.js';
    import NestPadding from './NestPadding.svelte';

    export let fileData;
    export let treePath;
    export let treeLevel = 0;

    
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
</script>

<div class="flex align-center file-title"
    draggable="true"
    on:dragstart={handleDragStart}
    on:click={(_) => openNewFile(fileData.id, metadata.title)}
    >
    <NestPadding {treeLevel} />
    <span class="{metadata.fileType}">{navFileTypePrefix[metadata.fileType]}</span><span>{metadata.title}</span>
</div>

<style>
    .function {
        color: var(--function-color);
        margin-right: 6px;
        font-weight: bold;
        font-size: 10pt;
    }
</style>
