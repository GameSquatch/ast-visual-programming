<script>
    import { flowDropHandler } from '../../lib/js/drag_and_drop/drag_and_drop_handlers.js'
    import { utilNamesThatMatchContextDataType } from './flow_utilities.js';
    import Argument from '../Argument.svelte';
    import constructors from '../../lib/js/constructors.js';
    import nodeTemplates from '../../lib/js/node_templates.js';
    import { utilDefs } from '../../lib/js/util_definitions.js';

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
        const args = fnDef.args.map((argType) => nodeTemplates[argType + "Literal"]());

        nodeData = {
            ...nodeData,
            utilityMethod,
            arguments: args,
            dataType: fnDef.returnType
        };
    };


    const populateArgument = (argIndex) => (node) => {
        if (node === null) return;

        nodeData.arguments.splice(argIndex, 1, node);
        nodeData.arguments = [
            ...nodeData.arguments
        ];
    };

    function onClear(i, argument) {
        nodeData.arguments[i] = nodeTemplates[argument.dataType + "Literal"]()
    }
</script>

<div class="component-wrapper">
    <p><strong>{nodeData.utilityName}</strong></p>
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
                on:innerDrop={(event) => flowDropHandler({ contextName: 'argument', contextType: argument.dataType, stateChangeCallback: populateArgument(i) })(event.detail)}
                onClear={() => onClear(i, argument)}
                returnType={argument.dataType}>

                <!-- <ClearNodeProp onClick={(_) => nodeData.arguments[i] = nodeTemplates[argument.dataType + "Literal"]()} /> -->
                {#if argument.type === "UtilityCallExpression"}
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