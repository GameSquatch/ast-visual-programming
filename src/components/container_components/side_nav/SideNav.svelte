<script>
    import FlowObjectSource from './FlowObjectSource.svelte';
    import { doActionDataDrag, stringUtilDataDrag } from '../../../drag_start_data_creators.js';
    import { fileTree, openFunction } from '../../../store/stores.js';

    function openNewFunction(functionId) {
        $openFunction = functionId;
    }
</script>

<div class="side-nav-wrapper">
    <div class="project-structure-pane">
        {#each $fileTree as item (item.id)}
            <div class:selected={item.id === $openFunction} on:click={(event) => openNewFunction(item.id)} class="tree-item">{item.title}</div>
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
    .tree-item.selected {
        background: #737373;
        color: #ddd;
        font-weight: 800;
    }
</style>