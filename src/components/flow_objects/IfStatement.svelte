<script>
    import constructors from "../../lib/js/constructors.js";
    import { flowDropHandler } from '../../lib/js/drag_and_drop/drag_and_drop_handlers.js';
    import { mockData } from '../../lib/js/data_json.js';
    import { contextMenuStore } from "../../store/context_menu_store.js";
    import { moveFlowStepDrag } from '../../lib/js/drag_and_drop/drag_start_data_creators.js';
    import nodeTemplates from "../../lib/js/node_templates.js";
    import SubFlow from './SubFlow.svelte';
    import FlowStepConnector from "./FlowStepConnector.svelte";
    import DragHandle from '../DragHandle.svelte';

    export let nodeData;
    export let nodePath;

    function handleDrop(node) {
        if (node === null) {
            return;
        }

        mockData.setNodeAt({ path: `${nodePath}.test`, nodeData: node });
    }


    /**
     * @function
     * @param {Event} event
     */
    function showContextMenu(event) {
        if (nodeData.test.type !== "RefIdentifier") {
            return;
        }

        event.stopPropagation();
        event.preventDefault();
        const menuItems = [{
            title: 'Change to Assignment',
            onSelected: () => {
                const flowStep = nodeTemplates.flowStep();
                flowStep.expression = nodeTemplates.variableRefAssignment({
                    refId: nodeData.test.refId,
                    dataType: 'Boolean',
                    fnRefType: nodeData.test.fnRefType
                });

                mockData.setNodeAt({ path: nodePath, nodeData: flowStep });
            }
        }];
            
        contextMenuStore.update((state) => ({
            showing: true,
            x: event.clientX,
            y: event.clientY,
            menuItems
        }));
    }


    function handleDragStart(event) {
        const dragData = moveFlowStepDrag({ flowStepFromPath: nodePath });
        
        event.dataTransfer.setData('text/json', JSON.stringify(dragData));
    }
</script>


<div on:contextmenu={showContextMenu} on:dragstart|stopPropagation={handleDragStart}>
    <div
        on:drop|stopPropagation={flowDropHandler({ contextName: 'argument', contextType: 'Boolean', stateChangeCallback: handleDrop })}
        on:dragover|preventDefault={() => {}}
        class='flow-step-container if-statement-container'
    >
    
        <div class="flex w100 flow-step-action-bar">
            <div class="flex-1 flex">
                <button class="light-bg-btn delete-btn" on:click={() => mockData.deleteFlowStepAt(nodePath)}><i class="mi-delete" /></button>
            </div>
            <DragHandle  />
        </div>

        {#if nodeData.test}
            if
            <svelte:component this={constructors[nodeData.test.type]} nodeData={nodeData.test} nodePath={`${nodePath}.test`} contextType={'Boolean'} />
        {:else}
            <div class="drag-here"><span>Drag Boolean Here</span></div>
        {/if}
        
    </div>

    
    <div class="flex branches-wrapper">
        <div class="false-flow flex-1">
            else
            <SubFlow nodePath={`${nodePath}.alternate.body`} subFlowBody={nodeData.alternate.body} />
        </div>

        <div class="true-flow flex-1">
            then
            <SubFlow nodePath={`${nodePath}.consequent.body`} subFlowBody={nodeData.consequent.body} />
        </div>
    </div>
</div>

<FlowStepConnector
    {nodePath}
    dragOverHandler={() => {}} />

<style>
    .branches-wrapper {
        min-width: 700px;
    }

    .true-flow, .false-flow {
        padding: 8px;
    }
    .true-flow {
        border: 1px solid green;
    }
    .false-flow {
        border: 1px solid red;
    }

    .drag-here {
        padding: 24px 30px;
        border-radius: 10px;
        border: 1px dashed black;
    }

    .flow-step-action-bar {
        position: absolute;
        top: 0;
        left: 0;
        padding: 4px;
    }

    .delete-btn {
        border-width: 1px;
        padding: 0 5px;
        border-radius: 5px;
    }
</style>