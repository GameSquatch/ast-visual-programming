<script>
    import { fileMetadata } from './side_nav/file_metadata.js';
    import { fnInfoRefObjectDrag } from '../lib/js/drag_and_drop/drag_start_data_creators.js';

    export let functionInfo;

    $: metaData = $fileMetadata[functionInfo.id];

    function dragStart(event, varData) {
        const dragData = fnInfoRefObjectDrag(varData);
        event.dataTransfer.setData('text/json', JSON.stringify(dragData));
    }
</script>

<div class="quick-access-floater">
    <p>Quick Access</p>
    <div class="left-col">
        <p class="col-header">Variables</p>
        {#each Object.keys(functionInfo.variables) as variableId (variableId)}
            {@const varData = functionInfo.variables[variableId]}
            <span
                on:dragstart={(event) =>
                    dragStart(event, {
                        ...varData,
                        refId: variableId,
                        dragType: 'variableRef',
                        fnRefType: 'variables'
                    })}
                class="var-tag"
                draggable="true"
                >{varData.name}
            </span>
        {/each}
    </div>

    <div class="right-col">
        <p class="col-header">Parameters</p>
        {#each Object.keys(metaData.objectFlowData.parameters) as paramId (paramId)}
            {@const paramData = metaData.objectFlowData.parameters[paramId]}
            <span
                on:dragstart={(event) =>
                    dragStart(event, {
                        ...paramData,
                        refId: paramId,
                        dragType: 'variableRef',
                        fnRefType: 'parameters'
                    })}
                class="var-tag"
                draggable="true">{paramData.name}</span>
        {/each}
    </div>
</div>

<style>
    .quick-access-floater {
        z-index: 2;
        position: absolute;
        top: 25px;
        right: 15px;
        width: 30%;
        min-width: 350px;
        display: flex;
        flex-wrap: wrap;
        padding: 10px 0;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 12px;
    }
    .quick-access-floater > p {
        width: 100%;
        text-align: center;
    }

    .var-tag {
        padding: 3px 12px;
        border-radius: 20px;
        background-color: #efefef;
        cursor: move;
        min-width: 80px;
        text-align: center;
        margin-bottom: 10px;
        box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.24);
    }

    .left-col,
    .right-col {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .col-header {
        margin-bottom: 10px;
    }
</style>
