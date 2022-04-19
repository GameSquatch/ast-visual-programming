<script>
    import constructors from '../../constructors.js';
    import VarIdentifier from '../flow_objects/VarIdentifier.svelte';
    import { flowDropHandler } from '../../drag_and_drop_handlers.js';
    import ClearNodeProp from '../ClearNodeProp.svelte';

    export let nodeData;
    export let nodePath;

    const stateChangeOnDrop = (node) => {
        if (node === null) return;

        nodeData.right = node;
    }
</script>

<div class="flex">
    <div class="set-block">
        <p>Set {nodeData.left.returns},</p>
        <p>
            <strong><VarIdentifier bind:nodeData={nodeData.left} isArgument={false} nodePath={nodePath + ".left"} /></strong>
        </p>
        <p>to</p>
    </div>
    <p class="equality-symbol"> = </p>
    <div class="assign-right-block flex-1" 
        on:dragover={()=>{}}
        on:drop|stopPropagation={flowDropHandler({ contextName: 'assignment', contextType: nodeData.left.returns, stateChangeCallback: stateChangeOnDrop })}>
        
        {#if nodeData.right === null}
            Drag an expression here
        {:else}
            <ClearNodeProp onClick={(_) => nodeData.right = null} />
            <svelte:component this={constructors[nodeData.right.type]} bind:nodeData={nodeData.right} contextType={nodeData.left.returns} nodePath={nodePath + ".right"} />
        {/if}
    </div>
</div>


<style>
    .set-block {
        width: 15%;
        min-width: 100px;
        max-width: 200px;
        overflow-x: auto;
        align-self: center;
    }

    .equality-symbol {
        align-self: center;
        padding: 0 8px;
    }

    .assign-right-block {
        padding: 10px;
        border-left: 1px solid black;
        position: relative;
    }
</style>