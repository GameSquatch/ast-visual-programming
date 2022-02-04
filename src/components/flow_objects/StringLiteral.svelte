<script>
    export let parentRef;
    export let accessor;
    export let isArgument = false;

    $: self = parentRef[accessor];
</script>

{#if isArgument}
    <input value={self?.value ?? ""} />
{:else}
    <span>"{self?.value ?? ""}"</span>
{/if}