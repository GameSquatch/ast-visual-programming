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

        for (let i = 0; i < parameterKeys.length; ++i) {
            const parameter = parameters[parameterKeys[i]];
            const arg = nodeData.arguments[i];

            if (!arg) {
                nodeData.arguments.push(nodeTemplates[parameter.dataType + 'Literal']({}) );
                continue;
            }

            if (parameter.dataType !== arg.dataType) {
                nodeData.arguments[i] = nodeTemplates[parameter.dataType + 'Literal']({});
            }
        }
        
        nodeData.arguments = nodeData.arguments;
    });


    const populateArgument = (argIndex) => (node) => {
        if (node === null) return;

        nodeData.arguments.splice(argIndex, 1, node);
        nodeData.arguments = nodeData.arguments;
    };

    function onClear(i, argument) {
        nodeData.arguments[i] = nodeTemplates[argument.dataType + "Literal"]({})
    }
</script>

<div class="component-wrapper">
    <p><strong>{$fileMetadata[nodeData.fileId].title}</strong>.call()</p>
    <div class="arguments-wrapper">
        {#each nodeData.arguments as argument, i (i)}
            <Argument {argLevel} 
                on:innerDrop={(event) => flowDropHandler({ contextName: 'argument', contextType: argument.dataType, stateChangeCallback: populateArgument(i) })(event.detail)}
                onClear={() => onClear(i, argument)}
                returnType={argument.dataType}>

                {#if argument.type === "FunctionCallExpression"}
                    <svelte:self bind:nodeData={argument} argLevel={argLevel + 1} isArgument={true} contextType={argument.dataType} nodePath={nodePath + ".arguments." + i} />
                {:else}
                    <svelte:component
                        this={constructors[argument.type]}
                        bind:nodeData={argument}
                        argLevel={argLevel + 1}
                        isArgument={true}
                        contextType={argument.dataType}
                        nodePath={nodePath + ".arguments." + i} />
                {/if}
            </Argument>
        {/each}
    </div>
</div>

<style>
</style>