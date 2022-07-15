<script>
    import { flowDropHandler } from '../../lib/js/drag_and_drop/drag_and_drop_handlers.js'
    import { fileMetadata } from '../side_nav/file_tree.js';
    import ClearNodeProp from '../ClearNodeProp.svelte';
    import Argument from '../Argument.svelte';
    import constructors from '../../lib/js/constructors.js';
    import nodeTemplates from '../../lib/js/node_templates.js';

    export let nodeData;
    export let contextType;
    export let isArgument = false;
    export let argLevel = 1;
    export let nodePath;


    const populateArgument = (argIndex) => (node) => {
        if (node === null) return;

        nodeData.parameters.splice(argIndex, 1, node);
        nodeData.parameters = [
            ...nodeData.parameters
        ];
    };

    function onClear(i, argument) {
        nodeData.arguments[i] = nodeTemplates[argument.returns + "Literal"]({})
    }
</script>

<div class="component-wrapper">
    <p><strong>{$fileMetadata[nodeData.metadataId].title}</strong>.call()</p>
    <!-- <div class="arguments-wrapper">
        {#each Object.keys($fileMetadata.objectFlowData.parameters) as paramKey, i (paramKey)}
            {@const parameter = $fileMetadata.objectFlowData.parameters[paramKey]}
            <Argument {argLevel} 
                on:innerDrop={(event) => flowDropHandler({ contextName: 'argument', contextType: parameter.returns, stateChangeCallback: populateArgument(i) })(event.detail)}
                onClear={() => onClear(i, parameter)}
                returnType={parameter.returns}>

                <ClearNodeProp onClick={(_) => nodeData.parameters[i] = nodeTemplates[parameter.returns + "Literal"]({})} />
                {#if parameter.type === "FunctionCallExpression"}
                    <svelte:self bind:nodeData={parameter} argLevel={argLevel + 1} isArgument={true} contextType={parameter.returns} nodePath={nodePath + ".parameters." + i} />
                {:else}
                    <svelte:component
                        this={constructors[parameter.type]}
                        bind:nodeData={parameter}
                        argLevel={argLevel + 1}
                        isArgument={true}
                        contextType={parameter.returns}
                        nodePath={nodePath + ".parameters." + i} />
                {/if}
            </Argument>
        {/each}
    </div> -->
</div>

<style>
</style>