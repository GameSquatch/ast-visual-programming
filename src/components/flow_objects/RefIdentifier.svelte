<script>
    import typeDefs from '../../lib/js/type_definitions.js';
    import nodeTemplates from '../../lib/js/node_templates.js';
    import { currentFlowData } from '../tabbed_editor/editor_store.js';
    import { fileMetadata } from '../side_nav/file_metadata.js';

    export let nodeData;
    export let contextType = null;
    export let isArgument = false;
    export let nodePath;

    let usesTypeMethod = false;

    const typeMethods = typeDefs[contextType ?? nodeData.dataType];

    function typeMatches(utilityKey) {
        return typeMethods[utilityKey].returnType === nodeData.dataType;
    }
    const availableMethods = (contextType ?? false) ? Object.keys(typeMethods).filter(typeMatches) : [];

    function methodSelected(event) {
        if (!event.target.value) {
            usesTypeMethod = false;
            return;
        }

        nodeData = nodeTemplates.identifierRefCallExpression({
            method: event.target.value,
            dataType: nodeData.dataType,
            refData: nodeData
        });

        usesTypeMethod = true;
    }
</script>


{#if nodeData.refId && nodeData.fnRefType === 'variables'}
    <span class="variable-name self">{$currentFlowData.info[nodeData.fnRefType][nodeData.refId]?.name ?? ""}</span>
{/if}
{#if nodeData.refId && nodeData.fnRefType === 'parameters'}
    <span class="parameter-name self">{$fileMetadata[$currentFlowData.info.id].objectFlowData.parameters[nodeData.refId]?.name ?? ""}</span>
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

    .variable-name {
        color: #00ca00;
    }
    .parameter-name {
        color: rgb(198, 0, 198);
    }
</style>