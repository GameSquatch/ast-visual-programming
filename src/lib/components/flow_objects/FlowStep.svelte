<script>
    import { createEventDispatcher } from 'svelte';
    import { flowDropHandler } from "../../lib/js/drag_and_drop/drag_and_drop_handlers.js";
    import constructors from "../../lib/js/constructors.js";
    import DragHandle from '../DragHandle.svelte';
    import { moveFlowStepDrag } from '../../lib/js/drag_and_drop/drag_start_data_creators.js';
    import { fileDataStore } from '../../lib/js/file_data_store.js';
    import { contextMenuStore } from '../../store/context_menu_store.js';
    import { fileMetadata } from '../side_nav/file_metadata.js';
    import { get } from 'svelte/store';
    import nodeTemplates from '../../lib/js/node_templates.js';
    import FlowStepConnector from './FlowStepConnector.svelte';

    /** @type {import('../../lib/js/drag_and_drop/drag_start_data_creators.js').FlowStepNode} */
    export let nodeData;
    /** @type {string} */
    export let nodePath;

    let beingDragged = false;
    let isFocused = false;
    const dispatch = createEventDispatcher();

    function dragOverHandler(event) {
        // do something like change cursor
    }

    function insertDragOverHandler(event) {
        // something
    }

    function dropModify(node) {
        if (node === null || node.dragType === 'moveFlowStep') return;

        nodeData.expression = node;
    }

    
    function handleDragStart(event) {
        const dragData = moveFlowStepDrag({ flowStepFromPath: nodePath });
        
        event.dataTransfer.setData('text/json', JSON.stringify(dragData));
        beingDragged = true;
    }

    
    function checkDropCancel(event) {
        beingDragged = false;
    }

    /**
     * @param {KeyboardEvent} event
     */
    function checkKeyUp(event) {
        // TODO
        if (event.key === 'ArrowUp') {
            dispatch('moveStep', 'up');
        }
        if (event.key === 'ArrowDown') {
            dispatch('moveStep', 'down');
        }

        if (['ArrowUp', 'ArrowDown'].includes(event.key)) {
            event.stopPropagation();
        }
    }

    /**
     * @function
     * @param {Event} event
     */
    function showChangeContextMenu(event) {
        const fm = get(fileMetadata);
        const isBoolAssignment = nodeData.expression?.type === 'AssignmentExpression' && nodeData.expression.left?.dataType === 'Boolean';
        const isBoolFunctionCall = nodeData.expression?.type === 'FunctionCallExpression' && fm[nodeData.expression.fileId].objectFlowData.returnType === 'Boolean';
        
        if (isBoolAssignment || isBoolFunctionCall) {
            event.preventDefault();
            event.stopPropagation();
            const testData = isBoolAssignment
                ? nodeData.expression.left
                : nodeData.expression;
                
            contextMenuStore.update((state) => ({
                showing: true,
                x: event.clientX,
                y: event.clientY,
                menuItems: [
                    {
                        title: 'Change To If Statement',
                        onSelected: () => fileDataStore.setNodeAt({ path: nodePath, nodeData: nodeTemplates.ifStatement({ testData }) })
                    }
                ]
            }));
        }
    }
</script>

<div class:beingDragged>
    <div tabindex=0
        on:dragover|preventDefault={dragOverHandler}
        on:drop|stopPropagation={flowDropHandler({ contextName: 'flowStep', stateChangeCallback: dropModify })}
        class="flow-step-container"
        on:dragstart|stopPropagation={handleDragStart}
        on:dragend|stopPropagation={checkDropCancel}
        on:focus={() => isFocused = true}
        on:blur={() => isFocused = false}
        on:keyup|preventDefault={checkKeyUp}
        on:contextmenu={showChangeContextMenu} >

        <div class="flex w100 flow-step-action-bar">
            <div class="flex-1 flex">
                <button class="light-bg-btn delete-btn" on:click={() => fileDataStore.deleteFlowStepAt({ path: nodePath })}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="delete-icon">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg></button>
            </div>
            <DragHandle  />
        </div>
    
        {#if nodeData?.expression ?? false}
            <svelte:component
                this={constructors[nodeData.expression.type]}
                nodeData={nodeData.expression}
                nodePath={nodePath + ".expression"}
            />
        {:else}
            <p class="dull-text">Drag an action here</p>
        {/if}
    </div>
    
    <FlowStepConnector
        {nodePath}
        dragOverHandler={insertDragOverHandler} />
</div>

<style>
    .beingDragged {
        opacity: 0.4;
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

    .delete-btn .delete-icon {
        width: 14px;
        height: 14px;
    }
</style>
