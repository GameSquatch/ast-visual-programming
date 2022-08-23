<script>
    import constructors from "../../lib/js/constructors.js";
    import { flowDropHandler } from '../../lib/js/drag_and_drop/drag_and_drop_handlers.js';
    import { mockData } from '../../lib/js/data_json.js';
    import SubFlow from './SubFlow.svelte';

    export let nodeData;
    export let nodePath;

    function handleDrop(node) {
        if (node === null) {
            return;
        }

        mockData.setNodeAt({ path: `${nodePath}.test`, nodeData: node });
    }
</script>


<div class="if-statement-container">
    <div
        on:drop|stopPropagation={flowDropHandler({ contextName: 'argument', contextType: 'Boolean', stateChangeCallback: handleDrop })}
        on:dragover|preventDefault={() => {}}
        class='flow-step-container'
    >
        <svelte:component this={constructors[nodeData.test.type]} nodeData={nodeData.test} nodePath={`${nodePath}.test`} contextType={'Boolean'} />
    </div>
    
    <div class="flex branches-wrapper">
        <div class="false-flow flex-1">
            <SubFlow nodePath={`${nodePath}.alternate.body`} subFlowBody={nodeData.alternate.body} />
        </div>

        <div class="true-flow flex-1">
            <SubFlow nodePath={`${nodePath}.consequent.body`} subFlowBody={nodeData.consequent.body} />
        </div>
    </div>
</div>

<style>
    .branches-wrapper {
        min-width: 700px;
    }

    .true-flow {
        background: rgba(0, 255, 0, 0.2);
    }
    .false-flow {
        background: rgba(255, 0, 0, 0.2);
    }
</style>