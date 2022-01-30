<script>
    import StringLiteral from './StringLiteral.svelte';
    import UtilityDefinitions from '../../utility_definitions.js';
    import constructors from '../../constructors.js';

    export let parentRef;
    export let accessor;

    $: self = parentRef[accessor];

    const onPropertyChange = (event) => {
        parentRef[accessor] = {
            ...self,
            utilityMethod: event.target.value,
            "arguments": []
        };
    };
</script>

<p style="padding-left: 10px">
    <span>{self.utilityName}.<select on:change={onPropertyChange}>
        {#each Object.keys(UtilityDefinitions.StringUtil) as method}
            <option value={method} selected={method === self.utilityMethod}>{method}</option>
        {/each}
    </select></span>
    (
        {#each self.arguments as argument, i (i)}
            <div class="arg-box">
                {#if argument.type === "UtilityCallExpression"}
                    <svelte:self accessor={i} bind:parentRef={self.arguments} />
                {:else}
                    <svelte:component this={constructors[argument.type]} accessor={i} bind:parentRef={self.arguments} isArgument={true} />
                {/if}
            </div>
        {:else}
            {#each UtilityDefinitions[self.utilityName][self.utilityMethod].args as type, i}
                <div class="arg-box">
                    <StringLiteral accessor={i} bind:parentRef={self.arguments} value={""} isArgument={true} />
                </div>
            {/each}
        {/each}
    )
</p>

<style>
    .arg-box {
        margin-left: 10px;
        padding: 2px;
        border: 1px solid black;
    }
</style>