<script>
    import FunctionInfoTab from '../FunctionInfoTab.svelte';
    import { dropInsertAstCreation } from '../../drag_and_drop_handlers.js';
    import ast from '../../store/stores.js';
    import constructors from '../../constructors.js';
    
    /**
     * @param {DragEvent} event
     */
    function dragOverHandler(event) {
        // do stuff like change the cursor
    }
    
    const appendDrop = (event) => {
        const data = dropInsertAstCreation(event);

        $ast.main.body = [...$ast.main.body, data];
    }

    // Will be fetched with API call
    const functionInfo = {
        "variables": [
            {
                "name": "aStr",
                "value": "",
                "type": "String"
            },
            {
                "name": "aNum",
                "value": 0,
                "type": "Integer"
            }
        ],
        "parameters": []
    };
</script>
    
<div
on:dragover|preventDefault={dragOverHandler}
on:drop|stopPropagation|preventDefault={appendDrop}
class="app-window-wrapper">

    <FunctionInfoTab {functionInfo} />

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