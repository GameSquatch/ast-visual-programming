<script>
    import { onDestroy } from 'svelte';
    import { flowDropHandler } from '../../lib/js/drag_and_drop/drag_and_drop_handlers.js'
    import { fileMetadata } from '../side_nav/file_metadata.js';
    import Argument from '../Argument.svelte';
    import { mockData } from '../../lib/js/data_json.js';
    import constructors from '../../lib/js/constructors.js';
    import nodeTemplates from '../../lib/js/node_templates.js';

    export let nodeData;
    export let contextType;
    export let isArgument = false;
    export let argLevel = 1;
    export let nodePath;

    let fm;
    let paramNames = [];

    // Populate empty arguments when the file metadata has params added to it
    // TODO: what happens when the param data type changes?
    const fmUnsub = fileMetadata.subscribe((metadata) => {
        fm = metadata;
        const parameters = metadata[nodeData.fileId].objectFlowData.parameters;
        const parameterKeys = Object.keys(parameters);

        for (let i = 0; i < parameterKeys.length; ++i) {
            const parameter = parameters[parameterKeys[i]];
            const arg = nodeData.arguments[i];
            paramNames[i] = parameter.name;

            if (!arg) {
                mockData.setNodeAt({
                    path: `${nodePath}.arguments.${nodeData.arguments.length}`,
                    nodeData: nodeTemplates[parameter.dataType + 'Literal']()
                });
                continue;
            }

            if (parameter.dataType !== arg.dataType) {
                mockData.setNodeAt({
                    path: `${nodePath}.arguments.${i}`,
                    nodeData: nodeTemplates[parameter.dataType + 'Literal']()
                });
            }
        }
    });

    onDestroy(fmUnsub);

    const populateArgument = (argIndex) => (node) => {
        if (node === null) return;

        mockData.setNodeAt({ path: `${nodePath}.arguments.${argIndex}`, nodeData: node });
    };

    function onClear(i, argument) {
        mockData.setNodeAt({
            path: `${nodePath}.arguments.${i}`,
            nodeData: nodeTemplates[argument.dataType + "Literal"]()
        });
    }
</script>

<div class="component-wrapper">
    <p><strong class="function-title">{fm[nodeData.fileId].title}</strong>.call()</p>
    <div class="arguments-wrapper">
        {#each nodeData.arguments as argument, i (i)}
            <Argument {argLevel}
                argName={paramNames[i]}
                on:innerDrop={(event) => flowDropHandler({ contextName: 'argument', contextType: argument.dataType, stateChangeCallback: populateArgument(i) })(event.detail)}
                onClear={() => onClear(i, argument)}
                returnType={argument.dataType}>

                {#if argument.type === "FunctionCallExpression"}
                    <svelte:self nodeData={argument} argLevel={argLevel + 1} isArgument={true} contextType={argument.dataType} nodePath={nodePath + ".arguments." + i} />
                {:else}
                    <svelte:component
                        this={constructors[argument.type]}
                        nodeData={argument}
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
    .function-title {
        color: orange;
    }
</style>