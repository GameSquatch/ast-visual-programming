<script>
    import { flowDropHandler } from '../../lib/js/drag_and_drop/drag_and_drop_handlers.js'
    import { fileMetadata } from '../side_nav/file_tree.js';
    import Argument from '../Argument.svelte';
    import constructors from '../../lib/js/constructors.js';
    import nodeTemplates from '../../lib/js/node_templates.js';

    export let nodeData;
    export let contextType;
    export let isArgument = false;
    export let argLevel = 1;
    export let nodePath;

    // Populate empty arguments when the file metadata has params added to it
    // TODO: what happens when the param data type changes?
    fileMetadata.subscribe((metadata) => {
        const parameters = metadata[nodeData.fileId].objectFlowData.parameters;
        const parameterKeys = Object.keys(parameters);

        if (parameterKeys.length === nodeData.arguments.length) {
            return;
        }
        
        nodeData.arguments = [
            ...nodeData.arguments,
            nodeTemplates[parameters[parameterKeys[parameterKeys.length - 1]].returns + 'Literal']({})
        ];
    });


    const populateArgument = (argIndex) => (node) => {
        if (node === null) return;

        nodeData.arguments.splice(argIndex, 1, node);
        nodeData.arguments = nodeData.arguments;
    };

    function onClear(i, argument) {
        nodeData.arguments[i] = nodeTemplates[argument.returns + "Literal"]({})
    }
</script>

<div class="component-wrapper">
    <p><strong>{$fileMetadata[nodeData.fileId].title}</strong>.call()</p>
    <div class="arguments-wrapper">
        {#each nodeData.arguments as argument, i (i)}
            <Argument {argLevel} 
                on:innerDrop={(event) => flowDropHandler({ contextName: 'argument', contextType: argument.returns, stateChangeCallback: populateArgument(i) })(event.detail)}
                onClear={() => onClear(i, argument)}
                returnType={argument.returns}>

                {#if argument.type === "FunctionCallExpression"}
                    <svelte:self bind:nodeData={argument} argLevel={argLevel + 1} isArgument={true} contextType={argument.returns} nodePath={nodePath + ".arguments." + i} />
                {:else}
                    <svelte:component
                        this={constructors[argument.type]}
                        bind:nodeData={argument}
                        argLevel={argLevel + 1}
                        isArgument={true}
                        contextType={argument.returns}
                        nodePath={nodePath + ".arguments." + i} />
                {/if}
            </Argument>
        {/each}
    </div>
</div>

<style>
</style>