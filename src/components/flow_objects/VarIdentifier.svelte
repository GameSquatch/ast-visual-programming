<script>
    import utilityDefinitions from '../../type_definitions.js';
    import dropDataTemplates from '../../drop_data_templates.js';
    import ast from '../../store/stores.js';

    export let parentRef;
    export let accessor;
    export let contextType;
    export let isArgument = false;

    let usesTypeMethod = false;

    $: self = parentRef[accessor];
    $: utilities = utilityDefinitions[contextType ?? self.returns];

    const typeMatches = (utilityKey) => utilities[utilityKey].returns === self.returns;

    function methodSelected(event) {
        if (!event.target.value) {
            usesTypeMethod = false;
            return;
        }

        const util = utilityDefinitions[self.returns][event.target.value];
        parentRef[accessor] = dropDataTemplates.typeUtil({ method: event.target.value, returns: self.returns, variable: self });

        usesTypeMethod = true;
    }
</script>
    

<span class="self">{$ast.main.info.variables[self.refId].name}</span>
{#if isArgument || usesTypeMethod}
    <select class="{usesTypeMethod ? '' : 'type-method-select'}" on:change={methodSelected}>
        <option selected></option>
        {#each Object.keys(utilityDefinitions[contextType ?? self.returns]).filter(typeMatches) as typeMethod}
            <option>{typeMethod}</option>
        {/each}
    </select>
{/if}


<style>
    .self {
        padding: 4px 2px;
    }
    .self:hover + .type-method-select, .type-method-select:hover {
        opacity: 1;
    }

    .type-method-select {
        padding: 8px;
        opacity: 0;
        transition: opacity 0.3s ease-out;
    }
</style>