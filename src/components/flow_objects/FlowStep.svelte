<script>
    import { createEventDispatcher } from 'svelte';
    import { flowDropHandler } from "../../lib/js/drag_and_drop/drag_and_drop_handlers.js";
    import constructors from "../../lib/js/constructors.js";
    import DragHandle from '../DragHandle.svelte';
    import { moveFlowStepDrag } from '../../lib/js/drag_and_drop/drag_start_data_creators.js';
    import { mockData } from '../../lib/js/data_json.js';
    import { contextMenuStore } from '../../store/context_menu_store.js';
    import { fileMetadata } from '../side_nav/file_metadata.js';
    import { get } from 'svelte/store';
    import nodeTemplates from '../../lib/js/node_templates.js';

    export let accessor;
    /** @type {import('../../lib/js/drag_and_drop/drag_start_data_creators.js').FlowStepNode} */
    export let nodeData;
    /** @type {string} */
    export let nodePath;

    let isOverInsertSpot = false;
    let beingDragged = false;
    let isFocused = false;
    const dispatch = createEventDispatcher();

    function dragOverHandler(event) {
        // do something like change cursor
    }

    function insertDragOverHandler(event) {
        // something
    }
    function insertDragEnter(event) {
        isOverInsertSpot = true;
    }
    function insertDragLeave(event) {
        isOverInsertSpot = false;
    }
    function removeInsertHover(event) {
        isOverInsertSpot = false;
    }

    function dropModify(node) {
        if (node === null || node.dragType === 'moveFlowStep') return;

        nodeData.expression = node;
    }
    
    function insertDrop(node) {
        if (node === null) {
            return;
        }

        if (node.dragType === "moveFlowStep") {// node is a dragObject at this point
            mockData.moveFlowStep({ fromPath: node.dragData.flowStepFromPath, toPath: nodePath });
            return;
        }

        mockData.insertNodeIntoFlowAt({ path: nodePath, nodeData: node, append: true });
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

    function showInsertContextMenu(event) {
        contextMenuStore.update((state) => ({
            showing: true,
            x: event.clientX,
            y: event.clientY,
            menuItems: [
                {
                    title: 'Add Flow Step',
                    onSelected: () => mockData.insertNodeIntoFlowAt({ path: nodePath, nodeData: nodeTemplates.flowStep(), append: true })
                },
                {
                    title: 'Add If Step',
                    onSelected: () => mockData.insertNodeIntoFlowAt({ path: nodePath, nodeData: nodeTemplates.ifStatement(), append: true })
                }
            ]
        }));
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
                    onSelected: () => mockData.setNodeAt({ path: nodePath, nodeData: nodeTemplates.ifStatement({ testData }) })
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
                <button class="light-bg-btn delete-btn" on:click={() => mockData.deleteFlowStepAt(nodePath)}><i class="mi-delete" /></button>
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
    <div
        on:dragover|preventDefault={insertDragOverHandler}
        on:dragenter|preventDefault={insertDragEnter}
        on:dragleave|preventDefault={insertDragLeave}
        on:drop|stopPropagation={flowDropHandler({ contextName: 'flow', stateChangeCallback: insertDrop })}
        on:drop|stopPropagation={removeInsertHover}
        on:contextmenu|stopPropagation|preventDefault={showInsertContextMenu}
        class="line-down-box"
        class:insert-drag-over={isOverInsertSpot}
    ></div>
</div>

<style>
    .line-down-box {
        margin-left: 20px;
        border-left: 1px dashed black;
        height: 30px;
    }

    .insert-drag-over {
        border-left: 2px dashed green;
        transition: height 0.3s ease-out;
        height: 45px;
    }

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
</style>
