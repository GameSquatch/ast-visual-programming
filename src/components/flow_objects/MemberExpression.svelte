<script>
    import Identifier from './Identifier.svelte';

    export let parentRef;
    export let accessor;
    export let isCallee = false;

    let self = parentRef[accessor];
</script>
    
<span>
    <svelte:component
        accessor={"object"}
        bind:parentRef={self}
        this={Identifier}
        isObject={true} />
    .
    <svelte:component
        on:changeMethod
        accessor={"property"}
        bind:parentRef={self}
        this={Identifier}
        isCalleeProperty={isCallee} />
</span>
    