<script>
    import constructors from '../../constructors.js';
    import VarIdentifier from '../flow_objects/VarIdentifier.svelte';
    import { flowDropHandler } from '../../drag_and_drop_handlers.js';
    import ClearNodeProp from '../ClearNodeProp.svelte';

    export let parentRef;
    export let accessor;

    $: self = parentRef[accessor];

    const stateChangeOnDrop = (node) => {
        if (node === null) return;

        parentRef[accessor].right = node;
    }
</script>

<p>Assign <strong><VarIdentifier bind:parentRef={self} accessor={"left"} isArgument={false} />: {self.left.returns}</strong> to</p>
<div class="assign-right-block" 
    on:dragover={()=>{}}
    on:drop|stopPropagation={flowDropHandler({ contextName: 'assignment', contextType: self.left.returns, stateChangeCallback: stateChangeOnDrop })}>
    
    {#if self.right === null}
        Drag an expression here
    {:else}
        <ClearNodeProp onClick={(_) => parentRef[accessor].right = null} />
        <svelte:component this={constructors[self.right.type]} bind:parentRef={self} accessor={"right"} isArgument={true} filterType={self.left.returns} />
    {/if}
</div>


<style>
    .assign-right-block {
        padding: 10px;
        border: 1px solid black;
        position: relative;
    }
</style>