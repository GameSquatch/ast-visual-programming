<script>
    import utilityDefinitions from '../../utility_definitions.js';
    import dropDataTemplates from '../../drop_data_templates.js';

    export let parentRef;
    export let accessor;
    export let isArgument = false;

    let usesTypeMethod = false;

    $: self = parentRef[accessor];
    $: utilities = utilityDefinitions[self.returns];

    const typeMatches = (utilityKey) => utilities[utilityKey].returns === self.returns;

    function methodSelected(event) {
        if (!event.target.value) {
            usesTypeMethod = false;
            return;
        }

        usesTypeMethod = true;

        const util = utilityDefinitions[self.returns][event.target.value];
        parentRef[accessor] = dropDataTemplates.typeUtil({
            name: self.returns,
            method: event.target.value,
            returns: util.returns,
            variableName: self.name
        });
    }
</script>
    

<span class="self">{self.name}</span>
{#if isArgument || usesTypeMethod}
    <select class="{usesTypeMethod ? '' : 'type-method-select'}" on:change={methodSelected}>
        <option selected></option>
        {#each Object.keys(utilityDefinitions[self.returns]).filter(typeMatches) as typeMethod}
            <option>{typeMethod}</option>
        {/each}
    </select>
{/if}


<style>
    .self {
        padding: 4px 6px;
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