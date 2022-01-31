<script>
    import FunctionInfoTab from '../FunctionInfoTab.svelte';
    import { createDropNodeFromContext } from '../../drag_and_drop_handlers.js';
    import ast from '../../store/stores.js';
    import constructors from '../../constructors.js';
    
    /**
     * @param {DragEvent} event
     */
    function dragOverHandler(event) {
        // do stuff like change the cursor
    }
    
    const appendDrop = (event) => {
        const data = createDropNodeFromContext('flow', event);

        $ast.main.body = [...$ast.main.body, data];
    }
</script>
    
<div
on:dragover|preventDefault={dragOverHandler}
on:drop|stopPropagation|preventDefault={appendDrop}
class="app-window-wrapper">

    <FunctionInfoTab bind:info={$ast.main.info} />

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