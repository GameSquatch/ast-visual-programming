<script>
    import constructors from '../../lib/js/constructors.js';
    import VariableRefIdentifier from './VariableRefIdentifier.svelte';
    import { flowDropHandler } from '../../lib/js/drag_and_drop/drag_and_drop_handlers.js';

    export let nodeData;
    export let nodePath;

    const stateChangeOnDrop = (node) => {
        if (node === null) return;

        nodeData.right = node;
    }
</script>

<div class="flex">
    <div class="set-block">
        <p>Set {nodeData.left.dataType},</p>
        <p>
            <strong><VariableRefIdentifier bind:nodeData={nodeData.left} isArgument={false} nodePath={nodePath + ".left"} /></strong>
        </p>
        <p>to</p>
    </div>
    <p class="equality-symbol"> = </p>
    <div class="assign-right-block flex-1" 
        on:dragover={()=>{}}
        on:drop|stopPropagation={flowDropHandler({ contextName: 'assignment', contextType: nodeData.left.dataType, stateChangeCallback: stateChangeOnDrop })}>
        
        {#if nodeData.right === null}
            Drag an expression here
        {:else}
            <!-- <ClearNodeProp onClick={(_) => nodeData.right = null} /> -->
            <svelte:component this={constructors[nodeData.right.type]} bind:nodeData={nodeData.right} contextType={nodeData.left.dataType} nodePath={nodePath + ".right"} />
        {/if}
    </div>
</div>


<style>
    .set-block {
        min-width: 100px;
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