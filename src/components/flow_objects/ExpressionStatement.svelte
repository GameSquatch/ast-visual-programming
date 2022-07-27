<script>
    import { createEventDispatcher } from 'svelte';
    import { flowDropHandler } from "../../lib/js/drag_and_drop/drag_and_drop_handlers.js";
    import constructors from "../../lib/js/constructors.js";
    import DragHandle from '../DragHandle.svelte';
    import { moveExpressionDrag } from '../../lib/js/drag_and_drop/drag_start_data_creators.js';

    export let accessor;
    export let nodeData;
    export let nodePath;

    let isOverInsertSpot = false;
    let beingDragged = false;
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
        if (node === null) return;
        
        if (node.dragType === "moveExpression") {// node is a dragObject at this point
            dispatch('replace', { oldIndex: node.dragData.currentIndex, newNode: node.nodeData });
            return;
        }

        if (node.type === 'ExpressionStatement') {// node is a node at this point
            nodeData.expression = node.expression;

        } else {
            nodeData.expression = node;
        }

    }
    
    function insertDrop(node) {
        if (node === null) {
            return;
        }

        if (node.dragType === "moveExpression") {// node is a dragObject at this point
            dispatch('moveExpression', { ...node, newIndex: accessor + 1 });
            return;
        }

        dispatch('insertAfter', node);// node is node at this point
    }

    /** @type {DragHandler} */
     function handleDragStart(event) {
        const dragData = moveExpressionDrag(nodeData, accessor);
        
        event.dataTransfer.setData('text/json', JSON.stringify(dragData));
        beingDragged = true;
    }

    /** @type {DragHandler} */
    function checkDropCancel(event) {
        beingDragged = false;
    }
</script>

<div class:beingDragged>
    <div tabindex=0
        on:dragover|preventDefault={dragOverHandler}
        on:drop|stopPropagation={flowDropHandler({ contextName: 'expression', stateChangeCallback: dropModify })}
        class="expression-container"
        on:dragstart|stopPropagation={handleDragStart}
        on:dragend|stopPropagation={checkDropCancel} >

        <div class="flex w100 flow-step-action-bar">
            <div class="flex-1 flex">
                <button class="delete-btn" on:click={() => dispatch('delete', accessor)}><i class="mi-delete" /></button>
            </div>
            <DragHandle  />
        </div>
    
        {#if nodeData && nodeData.expression !== null}
            <svelte:component
                this={constructors[nodeData.expression.type]}
                bind:nodeData={nodeData.expression}
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
        class="line-down-box"
        class:insert-drag-over={isOverInsertSpot}
    ></div>
</div>

<style>
    .expression-container {
        padding: 32px;
        border: 1px dashed black;
        position: relative;
        z-index: 1;
        overflow-x: auto;
        display: inline-block;
    }
    .expression-container:focus {
        border: 2px dashed blue;
    }

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
    }
</style>
