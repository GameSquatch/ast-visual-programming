<script>
    import constructors from '../../constructors.js';

    export let parentRef;
    export let accessor;

    $: self = parentRef[accessor];
</script>

<span>Assign <strong>{self.left.name}</strong> to</span>
{#if self.right === null}
    <p>Drag expression here</p>
{:else}
    <svelte:component this={constructors[self.right.type]} bind:parentRef={self} accessor={"right"} />
{/if}