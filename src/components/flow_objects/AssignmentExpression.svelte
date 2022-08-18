<script>
    import constructors from '../../lib/js/constructors.js';
import { mockData } from '../../lib/js/data_json.js';
    import { flowDropHandler } from '../../lib/js/drag_and_drop/drag_and_drop_handlers.js';
    import nodeTemplates from '../../lib/js/node_templates.js';

    export let nodeData;
    export let nodePath;

    function stateChangeOnDrop(node) {
        if (node === null) return;

        mockData.setNodeAt({ path: `${nodePath}.right`, nodeData: node });
    }

    function clearAssignment(_) {
        mockData.setNodeAt({ path: `${nodePath}.right`, nodeData: nodeTemplates[nodeData.left.dataType + 'Literal']() });
    }
</script>

<div class="flex">
    <div class="set-block">
        <p>Set {nodeData.left.dataType},</p>
        <p>
            <strong><svelte:component this={constructors[nodeData.left.type]} bind:nodeData={nodeData.left} isArgument={false} nodePath={nodePath + ".left"} /></strong>
        </p>
        <p>to</p>
    </div>
    <p on:click={clearAssignment} class="equality-symbol"> = </p>
    <div class="assign-right-block flex-1" 
        on:dragover={()=>{}}
        on:drop|stopPropagation={flowDropHandler({ contextName: 'assignment', contextType: nodeData.left.dataType, stateChangeCallback: stateChangeOnDrop })}>
        
        {#if nodeData.right === null}
            Drag an expression here
        {:else}
            <!-- <ClearNodeProp onClick={(_) => nodeData.right = null} /> -->
            <svelte:component this={constructors[nodeData.right.type]} nodeData={nodeData.right} contextType={nodeData.left.dataType} nodePath={nodePath + ".right"} />
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
        cursor: pointer;
    }

    .assign-right-block {
        padding: 10px;
        border-left: 1px solid black;
        position: relative;
    }
</style>