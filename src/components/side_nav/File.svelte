<script>
    import { editorStore } from '../../tabbed_editor/editor_store.js';

    export let fileData;

    function openNewFunction(functionId, functionTitle) {
        editorStore.openTab(functionId, functionTitle);
    }
</script>

<div class="file-title" on:click={(_) => openNewFunction(fileData.id, fileData.title)}>
    <span>{fileData.title}</span>
</div>

<style>
    .file-title {
        padding: 4px 6px;
        cursor: pointer;
    }
    .file-title:hover {
        background-color: #eee;
    }
</style>
