<script>
    // import FlowObjectSource from './FlowObjectSource.svelte';
    // import { stringUtilDataDrag } from '../../../lib/js/drag_and_drop/drag_start_data_creators.js';
    import { fileTree } from '../../../store/stores.js';
    import File from './File.svelte';
    import Folder from './Folder.svelte';
</script>

<div class="side-nav-wrapper">
    <div class="project-structure-pane">
        {#each $fileTree as item (item.id)}
            {#if item.type === 'file'}
            <File fileData={item} />
            {:else if item.type === 'folder'}
            <Folder fileData={item} />
            {/if}
        {/each}
    </div>

    <!-- <div class="utility-pane">
        <FlowObjectSource dragData={stringUtilDataDrag()}>String Util</FlowObjectSource>
    </div> -->
</div>
    
<style>
    .side-nav-wrapper {
        width: 24%;
        max-width: 425px;
        height: 100%;
        background: #ddd;
        display: flex;
        flex-direction: column;
    }
    
    .project-structure-pane {
        flex: 1;
    }
    
    /* .utility-pane {
        min-height: 200px;
        overflow: auto;
        border-top: 2px solid #888;
    } */
</style>