<script>
    import constructors from "../../lib/js/constructors.js";
    import SubFlow from './SubFlow.svelte';

    export let nodeData;
    export let nodePath;
</script>

<div>
    <svelte:component this={constructors[nodeData.test.type]} nodeData={nodeData.test} nodePath={`${nodePath}.test`} contextType={'Boolean'} />
</div>

<div class="flex">
    <div class="true-flow flex-1">
        <SubFlow nodePath={`${nodePath}.consequent.body`} subFlowBody={nodeData.consequent.body} />
    </div>

    <div class="false-flow flex-1">
        <SubFlow nodePath={`${nodePath}.alternate.body`} subFlowBody={nodeData.alternate.body} />
    </div>
</div>