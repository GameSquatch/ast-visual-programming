<script lang="ts">
    import typeDefs from '../../lib/js/type_definitions.js';
    import {AstNodeCreators} from '../../lib/js/ast_node_creators.js';
    import { fileDataStore } from '../../lib/js/file_data_store.js';
    import { fileMetadata } from '../side_nav/file_metadata.js';
    import { editorStore } from '../tabbed_editor/editor_store.js';

    export let nodeData;
    export let contextType = null;
    export let isArgument = false;
    export let nodePath;

    let usesTypeMethod = false;

    const typeMethods = typeDefs[contextType ?? nodeData.dataType];

    function typeMatches(utilityKey) {
        return typeMethods[utilityKey].returnType === nodeData.dataType;
    }
    const availableMethods = contextType ?? false ? Object.keys(typeMethods).filter(typeMatches) : [];

    function methodSelected(event) {
        if (!event.target.value) {
            usesTypeMethod = false;
            return;
        }

        const newNodeData = AstNodeCreators.identifierRefCallExpression({
            method: event.target.value,
            dataType: nodeData.dataType,
            refData: nodeData
        });

        fileDataStore.setNodeAt({ path: nodePath, nodeData: newNodeData });

        usesTypeMethod = true;
    }
</script>

{#if $fileDataStore[$editorStore.activeTab]}
    {#if nodeData.refId && nodeData.fnRefType === 'variables'}
        <span class="variable-name self">{$fileDataStore[$editorStore.activeTab].info[nodeData.fnRefType][nodeData.refId]?.name ?? ''}</span>
    {/if}
    {#if nodeData.refId && nodeData.fnRefType === 'parameters'}
        <span class="parameter-name self"
            >{$fileMetadata[$fileDataStore[$editorStore.activeTab].info.id].objectFlowData.parameters[nodeData.refId]
                ?.name ?? ''}</span>
    {/if}
{/if}

{#if availableMethods.length > 0}
    <select class={usesTypeMethod ? '' : 'type-method-select'} on:change={methodSelected}>
        <option selected />
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
    .self:hover + .type-method-select,
    .type-method-select:hover {
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
