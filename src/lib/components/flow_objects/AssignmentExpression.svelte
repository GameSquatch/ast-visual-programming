<script lang="ts">
    import constructors from '../../lib/js/constructors.js';
    import { fileDataStore } from '../../lib/js/file_data_store.js';
    import { flowDropHandler } from '../../lib/js/drag_and_drop/drag_and_drop_handlers.js';
    import { AstNodeCreators, type IAssignmentExpression } from '../../lib/js/ast_node_creators.js';

    export let nodeData: IAssignmentExpression;
    export let nodePath: string;

    function stateChangeOnDrop(node) {
        if (node === null) return;

        fileDataStore.setNodeAt({ path: `${nodePath}.right`, nodeData: node });
    }

    function clearAssignment(_) {
        fileDataStore.setNodeAt({ path: `${nodePath}.right`, nodeData: AstNodeCreators.literalFromDataType(nodeData.left.dataType)});
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