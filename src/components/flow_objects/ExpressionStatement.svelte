<script>
    import { flowDropHandler } from "../../drag_and_drop_handlers.js";
    import constructors from "../../constructors.js";
    import ClearNodeProp from '../ClearNodeProp.svelte';
    import { moveExpressionDrag } from '../../drag_types.js';

    export let accessor;
    export let parentRef;

    $: self = parentRef[accessor];
    let isOverInsertSpot = false;

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
     function handleMoveExpression(event) {
        const dragData = moveExpressionDrag();
        dragData.node = parentRef[accessor];

        event.dataTransfer.setData('text/json', JSON.stringify(dragData));

        deleteFlowStep(event);
    }
</script>

<div
    on:dragover|preventDefault={dragOverHandler}
    on:drop|stopPropagation|preventDefault={flowDropHandler({ contextName: 'expression', stateChangeCallback: dropModify })}
    on:dragstart|stopPropagation={handleMoveExpression}
    class="expression-container"
    draggable="true"
>
    <button class="expression-delete-btn" on:click={deleteFlowStep}>Delete</button>
    <ClearNodeProp onClick={(_) => parentRef[accessor].expression = null} />

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
/>

<style>
    .expression-container {
        padding: 32px;
        border: 1px dashed black;
        position: relative;
        max-width: 350px;
        z-index: 1;
    }

    .line-down-box {
        margin-left: 20px;
        border-left: 1px dashed black;
        height: 30px;
        /* transition: height 0.5s ease-out; */
    }

    .insert-drag-over {
        border-left: 2px dashed green;
        transition: height 0.3s ease-out;
        height: 45px;
    }

    .expression-delete-btn {
        position: absolute;
        opacity: 0;
        top: 6px;
        left: 6px;
        transition: opacity 0.3s ease-out;
    }

    .expression-container:hover .expression-delete-btn {
        opacity: 1;
    }
</style>
