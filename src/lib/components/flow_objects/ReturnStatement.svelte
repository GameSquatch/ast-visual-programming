<script lang="ts">
    import Argument from '../Argument.svelte';
    import constructors from '../../lib/js/constructors.js';
    import { fileDataStore } from '../../lib/js/file_data_store.js';
    import { fileMetadata } from '../side_nav/file_metadata';
    import { flowDropHandler } from '../../lib/js/drag_and_drop/drag_and_drop_handlers.js';
    import { AstNodeCreators, type IReturnStatement } from '../../lib/js/node_templates.js';

    export let nodeData: IReturnStatement;
    export let nodePath: string;

    $: returnType = $fileMetadata[nodeData.functionId].objectFlowData.returnType;

    function handleDrop(node) {
        if (node === null) {
            return;
        }

        fileDataStore.setNodeAt({ path: `${nodePath}.expression`, nodeData: node })
    }

    function clearStatement(_) {
        fileDataStore.setNodeAt({ path: `${nodePath}.expression`, nodeData: AstNodeCreators.literalFromDataType(returnType) });
    }
</script>

<p>return <span class="small-text">=&gt; {returnType}</span></p>

{#if nodeData?.expression ?? false}
    <Argument onClear={clearStatement} argLevel={1} {returnType} on:innerDrop={(event) => flowDropHandler({ contextName: 'assignment', contextType: returnType, stateChangeCallback: handleDrop})(event.detail)}>
        <svelte:component argLevel={1} nodeData={nodeData.expression} this={constructors[nodeData.expression.type]} contextType={returnType} nodePath={`${nodePath}.expression`} />
    </Argument>
{:else}
    <div on:dragover|preventDefault={() => {}} on:drop|stopPropagation={flowDropHandler({ contextName: 'assignment', contextType: returnType, stateChangeCallback: handleDrop})} class="return-expr">

    </div>
{/if}

<style>
    .return-expr {
        height: 35px;
        border: 1px dashed black;
    }
</style>