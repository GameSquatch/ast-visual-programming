<script>
    import constructors from "../../lib/js/constructors.js";
    import FlowStep from "./FlowStep.svelte";

    export let nodeData;
    export let nodePath;
</script>

<div>
    <svelte:component this={constructors[nodeData.test.type]} bind:nodeData={nodeData.test} nodePath={`${nodePath}.test`} contextType={'Boolean'} />
</div>

<div class="flex">
    <div class="true-flow flex-1">
        {#each nodeData.consequent.body as flowStep, i (flowStep.id)}
            <FlowStep bind:nodeData={flowStep} accessor={i} />
        {:else}
            <div>True Path</div>
        {/each}
    </div>

    <div class="false-flow flex-1">
        {#each nodeData.alternate.body as flowStep, i (flowStep.id)}
            <FlowStep bind:nodeData={flowStep} accessor={i} />
        {:else}
            <div>False Path</div>
        {/each}
    </div>
</div>