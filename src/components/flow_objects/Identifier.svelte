<script>
    import { createEventDispatcher } from 'svelte'

    export let parentRef;
    export let accessor;
    export let isObject = false;
    export let isCallee = false;
    export let isCalleeProperty = false;

    $: self = parentRef[accessor];

    let dispatch = createEventDispatcher();
    
    const onPropertyChange = (event) => {
        dispatch('changeMethod', {
            methodName: event.target.value
        });
    };
</script>
    
{#if !isCalleeProperty}
    <span>{self.name}</span>
{:else}
    <select on:change={onPropertyChange}>
        {#each Object.getOwnPropertyNames(String.prototype) as method}
            <option value={method} selected={method === self.name}>{method}</option>
        {/each}
    </select>
{/if}