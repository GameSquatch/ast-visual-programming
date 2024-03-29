<script lang="ts">
    import { onDestroy } from 'svelte';
    import { flowDropHandler } from '../../lib/js/drag_and_drop/drag_and_drop_handlers.js';
    import { fileMetadata } from '../side_nav/file_metadata.js';
    import Argument from '../Argument.svelte';
    import { fileDataStore } from '../../lib/js/file_data_store.js';
    import constructors from '../../lib/js/constructors.js';
    import { AstNodeCreators, type IFunctionCallExpression } from '../../lib/js/ast_node_creators.js';

    export let nodeData: IFunctionCallExpression;
    export let contextType;
    export let isArgument = false;
    export let argLevel = 1;
    export let nodePath: string;

    let fm;
    let paramNames: string[] = [];

    // Populate empty arguments when the file metadata has params added to it
    const fmUnsub = fileMetadata.subscribe((metadata) => {
        fm ??= metadata;
        const parameters = metadata[nodeData.fileId].objectFlowData.parameters;
        const parameterKeys = Object.keys(parameters);

        // When a parameter is deleted, we need the argument to be removed as well.
        // I am NOT sure how to handle modifying every single function that calls this function in a collaborative way yet
        // if (nodeData.arguments.length > parameterKeys.length) {
        //     fileDataStore.setNodeAt({
        //         path: `${nodePath}.arguments`,
        //         nodeData: nodeData.arguments.slice(0, parameterKeys.length)
        //     });
        //     return;
        // }

        let resetArgs = [];
        for (let i = 0; i < parameterKeys.length; ++i) {
            const parameter = parameters[parameterKeys[i]];
            const arg = nodeData.arguments[i];
            paramNames[i] = parameter.name;

            if (!arg) {
                resetArgs[i] = {
                    nodeData: AstNodeCreators.literalFromDataType(parameter.dataType),
                    name: parameter.name,
                    description: '',
                    dataType: parameter.dataType
                };
                continue;
            } else {
                resetArgs[i] = nodeData.arguments[i];
            }

            // When the parameter's data type changes
            if (parameter.dataType !== arg.dataType) {
                resetArgs[i] = {
                    nodeData: AstNodeCreators.literalFromDataType(parameter.dataType),
                    name: arg.name,
                    description: arg.description,
                    dataType: parameter.dataType
                };
            }
        }

        fileDataStore.setNodeAt({
            path: `${nodePath}.arguments`,
            nodeData: [...resetArgs]
        });
    });

    onDestroy(fmUnsub);

    const populateArgument = (argIndex: number) => (node) => {
        if (node === null) return;

        fileDataStore.setNodeAt({ path: `${nodePath}.arguments.${argIndex}.nodeData`, nodeData: node });
    };

    function onClear(i: number, argument) {
        fileDataStore.setNodeAt({
            path: `${nodePath}.arguments.${i}.nodeData`,
            nodeData: AstNodeCreators.literalFromDataType(argument.dataType)
        });
    }
</script>

<div class="component-wrapper">
    <p><strong class="function-title">{fm[nodeData.fileId].title}</strong>.call()</p>
    <div class="arguments-wrapper">
        {#each nodeData.arguments as argument, i (i)}
            <Argument
                {argLevel}
                name={paramNames[i]}
                description={argument.description}
                on:innerDrop={(event) =>
                    flowDropHandler({
                        contextName: 'argument',
                        contextType: argument.dataType,
                        stateChangeCallback: populateArgument(i)
                    })(event.detail)}
                onClear={() => onClear(i, argument)}
                returnType={argument.dataType}>
                {#if argument.type === 'FunctionCallExpression'}
                    <svelte:self
                        nodeData={argument.nodeData}
                        argLevel={argLevel + 1}
                        isArgument={true}
                        contextType={argument.dataType}
                        nodePath={nodePath + '.arguments.' + i + '.nodeData'} />
                {:else}
                    <svelte:component
                        this={constructors[argument.nodeData.type]}
                        nodeData={argument.nodeData}
                        argLevel={argLevel + 1}
                        isArgument={true}
                        contextType={argument.dataType}
                        nodePath={nodePath + '.arguments.' + i + '.nodeData'} />
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
