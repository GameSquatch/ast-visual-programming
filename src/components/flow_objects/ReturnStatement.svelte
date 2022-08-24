<script>
    import Argument from '../Argument.svelte';
    import constructors from '../../lib/js/constructors.js';
    import { mockData } from '../../lib/js/data_json.js';
    import { flowDropHandler } from '../../lib/js/drag_and_drop/drag_and_drop_handlers.js';
    import nodeTemplates from '../../lib/js/node_templates.js';

    export let nodeData;
    export let nodePath;

    $: returnType = $mockData[nodeData.functionId].info.returnType;

    function handleDrop(node) {
        if (node === null) {
            return;
        }

        mockData.setNodeAt({ path: `${nodePath}.expression`, nodeData: node })
    }

    function clearStatement(_) {
        mockData.setNodeAt({ path: `${nodePath}.expression`, nodeData: nodeTemplates[returnType + 'Literal']() });
    }
</script>

<p>return <span class="small-text">=&gt; {nodeData.returnType}</span></p>

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