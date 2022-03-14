<script>
    import constructors from '../../constructors.js';
    import VarIdentifier from '../flow_objects/VarIdentifier.svelte';
    import { flowDropHandler } from '../../drag_and_drop_handlers.js';
    import ClearNodeProp from '../ClearNodeProp.svelte';

    export let nodeData;

    const stateChangeOnDrop = (node) => {
        if (node === null) return;

        nodeData.right = node;
    }
</script>

<p>Assign <strong><VarIdentifier bind:nodeData={nodeData.left} isArgument={false} />: {nodeData.left.returns}</strong> to</p>
<div class="assign-right-block" 
    on:dragover={()=>{}}
    on:drop|stopPropagation={flowDropHandler({ contextName: 'assignment', contextType: nodeData.left.returns, stateChangeCallback: stateChangeOnDrop })}>
    
    {#if nodeData.right === null}
        Drag an expression here
    {:else}
        <ClearNodeProp onClick={(_) => nodeData.right = null} />
        <svelte:component this={constructors[nodeData.right.type]} bind:nodeData={nodeData.right} contextType={nodeData.left.returns} />
    {/if}
</div>


<style>
    .assign-right-block {
        padding: 10px;
        border: 1px solid black;
        position: relative;
    }
</style>