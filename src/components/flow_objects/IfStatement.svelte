<script>
    import constructors from "../../lib/js/constructors.js";
    import { flowDropHandler } from '../../lib/js/drag_and_drop/drag_and_drop_handlers.js';
    import { fileDataStore } from '../../lib/js/file_data_store.js';
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

        fileDataStore.setNodeAt({ path: `${nodePath}.test`, nodeData: node });
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

                fileDataStore.setNodeAt({ path: nodePath, nodeData: flowStep });
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
                <button class="light-bg-btn delete-btn" on:click={() => fileDataStore.deleteFlowStepAt(nodePath)}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="delete-icon">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg></button>
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

    .delete-icon {
        width: 14px;
        height: 14px;
    }
</style>