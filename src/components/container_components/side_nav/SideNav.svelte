<script>
    // import FlowObjectSource from './FlowObjectSource.svelte';
    // import { stringUtilDataDrag } from '../../../lib/js/drag_and_drop/drag_start_data_creators.js';
    import { fileTree } from '../../../store/stores.js';
    import File from './File.svelte';
    import Folder from './Folder.svelte';

    $: files = $fileTree.filter((item) => item.type === 'file');
    $: folders = $fileTree.filter((item) => item.type === 'folder');
</script>

<div class="side-nav-wrapper">
    <div class="flex w100 nav-action-bar">
        <div class="nav-action-btn"></div>
        <div class="nav-action-btn"></div>
    </div>

    <div class="project-structure-pane">
        {#each folders as folder (folder.id)}
            <Folder fileData={folder} />
        {/each}

        {#each files as file (file.id)}
            <File fileData={file} />
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

    .nav-action-bar {
        padding: 8px 4px;
    }
    .nav-action-btn {
        width: 35px;
        height: 35px;
        margin-right: 8px;
        background: red;
        border-radius: 10px;
    }
    
    /* .utility-pane {
        min-height: 200px;
        overflow: auto;
        border-top: 2px solid #888;
    } */
</style>