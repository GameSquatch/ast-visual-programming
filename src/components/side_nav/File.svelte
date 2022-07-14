<script>
    import { editorStore } from '../tabbed_editor/editor_store.js';

    export let fileData;

    function openNewFunction(functionId, functionTitle) {
        editorStore.openTab(functionId, functionTitle, 'function');
    }
</script>

<div class="file-title {fileData.objectType}" on:click={(_) => openNewFunction(fileData.id, fileData.title)}>
    <span>{fileData.title}</span>
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
