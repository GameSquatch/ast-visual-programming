<script>
    import { flowDropHandler } from '../../lib/js/drag_and_drop/drag_and_drop_handlers.js'
    import { utilNamesThatMatchContextDataType } from './flow_utilities.js';
    import Argument from '../Argument.svelte';
    import constructors from '../../lib/js/constructors.js';
    import nodeTemplates from '../../lib/js/node_templates.js';
    import { utilDefs } from '../../lib/js/util_definitions.js';
    import { mockData } from '../../lib/js/data_json.js';

    /** @type {import('../../lib/js/node_templates.js').UtilityCallExpressionData} */
    export let nodeData;
    /** @type {string} */
    export let contextType;
    export let isArgument = false;
    export let argLevel = 1;
    /** @type {string} */
    export let nodePath;

    function onPropertyChange(event) {
        const utilityMethod = event.target.value;
        const fnDef = utilDefs[nodeData.utilityName][utilityMethod];
        const args = fnDef.args.map((arg) => {
            return {
                nodeData: nodeTemplates[arg.dataType + "Literal"](),
                ...arg
            };
        });

        mockData.setNodeAt({
            path: nodePath,
            nodeData: {
                ...nodeData,
                utilityMethod,
                arguments: args,
                dataType: fnDef.returnType
            }
        });
    };


    const populateArgument = (argIndex) => (node) => {
        if (node === null) return;

        mockData.setNodeAt({ path: `${nodePath}.arguments.${argIndex}.nodeData`, nodeData: node });
    };

    function onClear(i, argument) {
        mockData.setNodeAt({
            path: `${nodePath}.arguments.${i}.nodeData`,
            nodeData: nodeTemplates[argument.dataType + "Literal"]()
        });
    }
</script>

<div class="component-wrapper">
    <p><strong class="utility-name">{nodeData.utilityName}</strong></p>
    <div class="method-container">
        <select on:change={onPropertyChange}>
            {#each utilNamesThatMatchContextDataType({ utilDefinitionName: nodeData.utilityName, contextDataType: contextType }) as method}
                <option value={method} selected={method === nodeData.utilityMethod}>{method}</option>
            {/each}
        </select>
        <span class="small-text">=&gt; {nodeData.dataType}</span>
    </div>
    <div class="arguments-wrapper">
        {#each nodeData.arguments as argument, i (i)}
            <Argument {argLevel}
                description={argument.description}
                name={argument.name}
                on:innerDrop={(event) => flowDropHandler({ contextName: 'argument', contextType: argument.dataType, stateChangeCallback: populateArgument(i) })(event.detail)}
                onClear={() => onClear(i, argument)}
                returnType={argument.dataType}>

                <!-- <ClearNodeProp onClick={(_) => nodeData.arguments[i] = nodeTemplates[argument.dataType + "Literal"]()} /> -->
                {#if argument.nodeData.type === "UtilityCallExpression"}
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

<style>
    .utility-name {
        color: rgb(0, 217, 217);
    }
</style>