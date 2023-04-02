<script lang="ts">
    import Argument from '../Argument.svelte';
    import { flowDropHandler } from '../../lib/js/drag_and_drop/drag_and_drop_handlers.js'
    import { methodNamesThatMatchContextDataType } from './flow_utilities.js';
    import constructors from '../../lib/js/constructors.js';
    import { AstNodeCreators, type IIdentiferRefCallExpression } from '../../lib/js/node_templates.js';
    import typeDefs from '../../lib/js/type_definitions.js'
    import { fileDataStore } from '../../lib/js/file_data_store';

    export let nodeData: IIdentiferRefCallExpression;
    export let contextType;
    export let isArgument = false;
    export let argLevel = 1;
    export let nodePath: string;

    function onPropertyChange(event) {
        const method = event.target.value;
        if (method === '') {
            fileDataStore.setNodeAt({ path: nodePath, nodeData: nodeData.refData });
            return;
        }

        const fnDef = typeDefs[nodeData.refData.dataType][method];
        const args = fnDef.args.map((arg) => {
            return {
                nodeData: AstNodeCreators.literalFromDataType(arg.dataType),
                ...arg
            }
        });

        fileDataStore.setNodeAt({
            path: nodePath,
            nodeData: {
                ...nodeData,
                method,
                arguments: args,
                dataType: fnDef.returnType
            }
        });
    }

    const dropArgument = (argIndex: number) => (node) => {
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

{#if nodeData.refData}
<div class="component-wrapper">
    <p><strong><svelte:component this={constructors[nodeData.refData.type]} bind:nodeData={nodeData.refData} isArgument={false} nodePath={nodePath + ".refData"} /></strong></p>
    <div class="method-container">
        <select on:change={onPropertyChange}>
            {#if !contextType || nodeData.refData.dataType === contextType}<option value=""></option>{/if}
            {#each methodNamesThatMatchContextDataType({ typeDefinitionName: nodeData.refData.dataType, contextDataType: contextType }) as method}
                <option value={method} selected={method === nodeData.method}>{method}</option>
            {/each}
        </select>
        <span class="small-text">=&gt; {nodeData.dataType}</span>
    </div>
    <div class="arguments-wrapper">
        {#each nodeData.arguments as argument, i (i)}
            <Argument
                name={argument.name}
                description={argument.description}
                {argLevel} 
                on:innerDrop={(event) => flowDropHandler({ contextName: 'argument', contextType: argument.dataType, stateChangeCallback: dropArgument(i) })(event.detail)}
                onClear={() => onClear(i, argument)}
                returnType={argument.dataType}>

                <!-- <ClearNodeProp onClick={(_) => nodeData.arguments[i] = nodeTemplates[argument.dataType + "Literal"]()} /> -->
                {#if argument.nodeData.type === "IdentifierRefCallExpression"}
                    <svelte:self nodeData={argument.nodeData} argLevel={argLevel + 1} isArgument={true} contextType={argument.dataType} nodePath={nodePath + ".arguments." + i + ".nodeData"} />
                {:else}
                    <svelte:component
                        this={constructors[argument.nodeData.type]}
                        nodeData={argument.nodeData}
                        argLevel={argLevel + 1}
                        isArgument={true}
                        contextType={argument.dataType}
                        nodePath={nodePath + ".arguments." + i + ".nodeData"} />
                {/if}
            </Argument>
        {/each}
    </div>
</div>
{/if}

<style>
</style>