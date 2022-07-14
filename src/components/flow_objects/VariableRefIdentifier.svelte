<script>
    import typeDefs from '../../lib/js/type_definitions.js';
    import nodeTemplates from '../../lib/js/node_templates.js';
    import { currentFlowData } from '../tabbed_editor/editor_store.js';

    export let nodeData;
    export let contextType = null;
    export let isArgument = false;
    export let nodePath;

    let usesTypeMethod = false;

    const typeMethods = typeDefs[contextType ?? nodeData.returns];

    const typeMatches = (utilityKey) => typeMethods[utilityKey].returns === nodeData.returns;
    const availableMethods = (contextType ?? false) ? Object.keys(typeMethods).filter(typeMatches) : [];

    function methodSelected(event) {
        if (!event.target.value) {
            usesTypeMethod = false;
            return;
        }

        nodeData = nodeTemplates.variableRefCallExpression({
            method: event.target.value,
            returns: nodeData.returns,
            refData: nodeData,
            fnRefType: nodeData.fnRefType
        });

        usesTypeMethod = true;
    }
</script>


{#if nodeData.refId}
    <span class="self">{$currentFlowData.info[nodeData.fnRefType][nodeData.refId]?.name ?? ""}</span>
{/if}
{#if availableMethods.length > 0}
    <select class="{usesTypeMethod ? '' : 'type-method-select'}" on:change={methodSelected}>
        <option selected></option>
        {#each Object.keys(typeMethods).filter(typeMatches) as typeMethod}
            <option>{typeMethod}</option>
        {/each}
    </select>
{/if}


<style>
    .self {
        padding: 4px 0;
        font-weight: bold;
    }
    .self:hover + .type-method-select, .type-method-select:hover {
        opacity: 1;
    }

    .type-method-select {
        opacity: 0;
        transition: opacity 0.3s ease-out;
    }
</style>