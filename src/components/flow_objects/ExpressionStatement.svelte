<script>
    import { createEventDispatcher } from 'svelte';
    import { flowDropHandler } from "../../drag_and_drop_handlers.js";
    import constructors from "../../constructors.js";
    import ClearNodeProp from '../ClearNodeProp.svelte';
    import DragHandle from '../DragHandle.svelte';
    import { moveExpressionDrag } from '../../drag_start_data_creators.js';

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
        if (node.currentIndex !== undefined) {
            dispatch('delete', node.currentIndex);
            node = node.moveData;
        }

        if (node.type === 'ExpressionStatement')
            nodeData.expression = node.expression;
        else
            nodeData.expression = node;

    }
    
    function insertDrop(node) {
        if (node === null) {
            return;
        }

        if (node.currentIndex !== undefined) {
            dispatch('moveExpression', { ...node, newIndex: accessor + 1 });
            return;
        }

        dispatch('insertAfter', node);
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
        on:drop|stopPropagation|preventDefault={flowDropHandler({ contextName: 'expression', stateChangeCallback: dropModify })}
        class="expression-container"
        on:dragstart|stopPropagation={handleDragStart}
        on:dragend|stopPropagation={checkDropCancel} >

        <DragHandle  />
        <div class="flex w100">
            {#if nodeData?.expression ?? false}
                <ClearNodeProp onClick={(_) => nodeData.expression = null} />
            {/if}
            <button class="delete-btn" on:click={() => dispatch('delete', accessor)}>Delete</button>
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
        on:drop|stopPropagation|preventDefault={flowDropHandler({ contextName: 'flow', stateChangeCallback: insertDrop })}
        on:drop|stopPropagation|preventDefault={removeInsertHover}
        class="line-down-box"
        class:insert-drag-over={isOverInsertSpot}
    ></div>
</div>

<style>
    .expression-container {
        padding: 10px 32px 32px;
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
</style>
