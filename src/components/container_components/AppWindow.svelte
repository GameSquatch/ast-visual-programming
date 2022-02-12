<script>
    import FunctionInfoTab from '../FunctionInfoTab.svelte';
    import { flowDropHandler } from '../../drag_and_drop_handlers.js';
    import ast from '../../store/stores.js';
    import constructors from '../../constructors.js';
    import { squish } from '../../custom_animations.js';
    import { flip } from 'svelte/animate';
    
    /**
     * @param {DragEvent} event
     */
    function dragOverHandler(event) {
        // do stuff like change the cursor
    }
    
    const appendDrop = (node) => {
        $ast.main.body = [...$ast.main.body, node];
    }
</script>
    
<div
on:dragover|preventDefault={dragOverHandler}
on:drop|stopPropagation|preventDefault={flowDropHandler({ contextName: 'flow', stateChangeCallback: appendDrop})}
class="app-window-wrapper">

    <FunctionInfoTab bind:info={$ast.main.info} />

    <div class="flow-wrapper">
        {#each $ast.main.body as flowObject, i (flowObject.id)}
            <div animate:flip="{{duration: 400}}" transition:squish|local="{{duration: 300, opacity: 0.4, start: 0.2}}">
                <svelte:component this={constructors[flowObject.type]} bind:parentRef={$ast.main.body} accessor={i} />
            </div>
        {/each}
    </div>
</div>
    
<style>
    .flow-wrapper {
        height: 100%;
        overflow: auto;
        padding-top: 75px;
        padding: 75px 10px 10px;
        z-index: -1;
    }

    .app-window-wrapper {
        position: relative;
        flex: 1;
        background: #efefef;
        z-index: 0;
    }
</style>