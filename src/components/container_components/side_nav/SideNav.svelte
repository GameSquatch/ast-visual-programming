<script>
    import FlowObjectSource from './FlowObjectSource.svelte';
    import { stringUtilDataDrag } from '../../../lib/js/drag_and_drop/drag_start_data_creators.js';
    import { fileTree } from '../../../store/stores.js';
    import { editorStore } from '../../tabbed_editor/editor_store.js';

    function openNewFunction(functionId, functionTitle) {
        editorStore.openTab(functionId, functionTitle);
    }
</script>

<div class="side-nav-wrapper">
    <div class="project-structure-pane">
        {#each $fileTree as item (item.id)}
            <div on:click={(_) => openNewFunction(item.id, item.title)} class="tree-item">{item.title}</div>
        {/each}
    </div>

    <div class="utility-pane">
        <FlowObjectSource dragData={stringUtilDataDrag()}>String Util</FlowObjectSource>
    </div>
</div>
    
<style>
    .side-nav-wrapper {
        width: 25%;
        max-width: 500px;
        height: 100%;
        background: #ddd;
        display: flex;
        flex-direction: column;
    }
    
    .project-structure-pane {
        flex: 1;
    }
    
    .utility-pane {
        min-height: 200px;
        overflow: auto;
        border-top: 2px solid #888;
    }

    .tree-item {
        padding: 8px;
        cursor: pointer;
    }
    .tree-item:hover {
        background: rgba(255,255,255,0.3);
    }
</style>