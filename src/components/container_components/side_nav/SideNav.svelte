<script>
    import FlowObjectSource from './FlowObjectSource.svelte';
    
    const doActionData = { "dragType": "expression" }
    const stringUtilData = { "dragType": "stringUtil" }
</script>

<div class="side-nav-wrapper">
    <div class="project-structure-pane">
        <FlowObjectSource dragData={doActionData}>Drag Me Tester</FlowObjectSource>
    </div>

    <div class="utility-pane">
        <FlowObjectSource dragData={stringUtilData}>String Util</FlowObjectSource>
    </div>
</div>
    
<style>
    .side-nav-wrapper {
        width: 33%;
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
</style>