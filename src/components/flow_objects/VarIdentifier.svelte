<script>
    import typeDefs from '../../type_definitions.js';
    import nodeTemplates from '../../node_templates.js';
    import ast from '../../store/stores.js';

    export let nodeData;
    export let contextType;
    export let isArgument = false;

    let usesTypeMethod = false;

    const typeMethods = typeDefs[contextType ?? nodeData.returns];

    const typeMatches = (utilityKey) => typeMethods[utilityKey].returns === nodeData.returns;

    function methodSelected(event) {
        if (!event.target.value) {
            usesTypeMethod = false;
            return;
        }

        nodeData = nodeTemplates.varCallExpression({
            method: event.target.value,
            returns: nodeData.returns,
            variable: nodeData
        });

        usesTypeMethod = true;
    }
</script>
    
{#if nodeData.refId}
    <span class="self">{$ast.main.info.variables[nodeData.refId].name}</span>
{/if}
{#if isArgument || usesTypeMethod}
    <select class="{usesTypeMethod ? '' : 'type-method-select'}" on:change={methodSelected}>
        <option selected></option>
        {#each Object.keys(typeMethods).filter(typeMatches) as typeMethod}
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