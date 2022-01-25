<script>
    import ExpressionStatement from '../flow_objects/ExpressionStatement.svelte';
    import IfStatement from '../flow_objects/IfStatement.svelte';
    import { dropInsertAstCreation, dropInsertHandler } from '../../drag_and_drop_handlers.js';
    import ast from '../../store/stores.js';
    
    const constructors = {
        "ExpressionStatement": ExpressionStatement,
        "IfStatement": IfStatement
    };
    
    /**
     * @param {DragEvent} event
     */
    function dragOverHandler(event) {
        // do stuff like change the cursor
    }

    $: bodyLength = $ast.main.body.length;
    
    const appendDrop = (event) => {
        const data = dropInsertAstCreation(event);

        $ast.main.body = [...$ast.main.body, data];
    }
</script>
    
<div on:dragover|preventDefault={dragOverHandler} on:drop|stopPropagation|preventDefault={appendDrop} class="app-window-wrapper">
    {#each $ast.main.body as flowObject, i (i)}
        <svelte:component this={constructors[flowObject.type]} bind:parentRef={$ast.main.body} accessor={i} />
    {/each}
</div>
    
<style>
    .app-window-wrapper {
        flex: 1;
        overflow: auto;
        background: #efefef;
    }
</style>