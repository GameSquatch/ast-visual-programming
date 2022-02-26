<script>
    import { flowDropHandler } from "../../drag_and_drop_handlers.js";
    import constructors from "../../constructors.js";
    import ClearNodeProp from '../ClearNodeProp.svelte';
    import DragHandle from '../DragHandle.svelte';
    import { moveExpressionDrag } from '../../drag_types.js';

    export let accessor;
    export let parentRef;

    $: self = parentRef[accessor];

    let isOverInsertSpot = false;
    let beingDragged = false;

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
        if (node.type === 'ExpressionStatement')
            parentRef[accessor].expression = node.expression;
        else
            parentRef[accessor].expression = node;
    }

    /**
     * @param {DragEvent} event
     */
    function insertDrop(node) {
        if (node === null) {
            return;
        }

        parentRef.splice(accessor + 1, 0, node);

        parentRef = [...parentRef];
    }

    function deleteFlowStep(_) {
        parentRef.splice(accessor, 1);

        parentRef = [...parentRef];
    }

    /**
     * @param {DragEvent} event
     */
     function handleDragStart(event) {
        const dragData = moveExpressionDrag(self);
        
        event.dataTransfer.setData('text/json', JSON.stringify(dragData));
        beingDragged = true;
    }

    /** @param {DragEvent} event */
    function checkDropCancel(event) {
        if (event.dataTransfer.dropEffect === 'none') {
            beingDragged = false;
            return;
        }

        deleteFlowStep(event);
    }
</script>

<div class:beingDragged>
    <div
        on:dragover|preventDefault={dragOverHandler}
        on:drop|stopPropagation|preventDefault={flowDropHandler({ contextName: 'expression', stateChangeCallback: dropModify })}
        class="expression-container"
        on:dragstart|stopPropagation={handleDragStart}
        on:dragend|stopPropagation={checkDropCancel}
    >
        <DragHandle  />
        <div class="flex w100">
            {#if self?.expression ?? false}
                <ClearNodeProp onClick={(_) => parentRef[accessor].expression = null} />
            {/if}
            <button on:click={deleteFlowStep}>Delete</button>
        </div>
    
        {#if self && self.expression !== null}
            <svelte:component
                this={constructors[self.expression.type]}
                accessor={"expression"}
                bind:parentRef={parentRef[accessor]}
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
