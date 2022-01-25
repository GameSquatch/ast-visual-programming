<script>
    import CallExpression from './CallExpression.svelte';
    import UtilityCallExpression from './UtilityCallExpression.svelte';
    import { dropInsertAstCreation, dropInsertHandler, dropModifyObjectHandler } from '../../drag_and_drop_handlers.js';
    import dropDataTemplates from '../../drop_data_templates';
    
    export let accessor;
    export let parentRef;

    const constructors = {
        "CallExpression": CallExpression,
        "UtilityCallExpression": UtilityCallExpression
    };

    $: self = parentRef[accessor];
    let isOverInsertSpot = false;
    
    function dragOverHandler(event) {
        // do something like change cursor
        //event.stopPropagation();
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


    //$: insertDrop = dropInsertHandler({ refObj: parentRef, accessor });
    
    /**
     * @param {DragEvent} event
     */
    function insertDrop(event) {
        const astNodes = dropInsertAstCreation(event);

        parentRef.splice(accessor + 1, 0, astNodes);
        
        parentRef = [...parentRef];
    }
</script>

    
<div on:dragover|preventDefault={dragOverHandler} on:drop|stopPropagation|preventDefault={dropModifyObjectHandler} class="expression-container">
    {#if self.expression !== null}
        <svelte:component this={constructors[self.expression.type]} accessor={"expression"} bind:parentRef={parentRef[accessor]} />
    {:else}
        <p class="dull-text">Drag an action here</p>
    {/if}
</div>
<div
    on:dragover|preventDefault={insertDragOverHandler}
    on:dragenter|preventDefault={insertDragEnter}
    on:dragleave|preventDefault={insertDragLeave}
    on:drop|stopPropagation|preventDefault={insertDrop}
    on:drop|stopPropagation|preventDefault={removeInsertHover}
    class="line-down-box"
    class:insert-drag-over={isOverInsertSpot}>
</div>

    
<style>
    .expression-container {
        padding: 35px;
        border: 1px dashed black;
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
</style>