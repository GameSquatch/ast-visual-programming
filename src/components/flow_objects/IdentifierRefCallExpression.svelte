<script>
    import Argument from '../Argument.svelte';
    import { flowDropHandler } from '../../lib/js/drag_and_drop/drag_and_drop_handlers.js'
    import typeDefs from '../../lib/js/type_definitions.js';
    import constructors from '../../lib/js/constructors.js';
    import nodeTemplates from '../../lib/js/node_templates.js';

    export let nodeData;
    export let contextType;
    export let isArgument = false;
    export let argLevel = 1;
    export let nodePath;

    let varTypeMethods = typeDefs[nodeData.refData.dataType];

    function onPropertyChange(event) {
        const method = event.target.value;
        if (method === '') {
            nodeData = {
                ...(nodeData.refData)
            };
            return;
        }

        const fnDef = varTypeMethods[method];
        const args = fnDef.args.map((argType) => nodeTemplates[argType + "Literal"]({}));

        nodeData = {
            ...nodeData,
            method,
            arguments: args,
            dataType: fnDef.returnType
        };
    }

    // !contextType is when things don't have a type in their parent context
    const matchParentTypeFilter = (methodName) => !contextType || varTypeMethods[methodName].returnType === contextType;


    const dropArgument = (argIndex) => (node) => {
        if (node === null) return;

        nodeData.arguments.splice(argIndex, 1, node);
        nodeData.aruments = [
            ...nodeData.arguments
        ];
    };

    function onClear(i, argument) {
        nodeData.arguments[i] = nodeTemplates[argument.dataType + "Literal"]({})
    }
</script>

{#if nodeData.refData}
<div class="component-wrapper">
    <p><strong><svelte:component this={constructors[nodeData.refData.type]} bind:nodeData={nodeData.refData} isArgument={false} nodePath={nodePath + ".refData"} /></strong></p>
    <div class="method-container">
        <select on:change={onPropertyChange}>
            {#if !contextType || nodeData.refData.dataType === contextType}<option value=""></option>{/if}
            {#each Object.keys(varTypeMethods).filter(matchParentTypeFilter) as method}
                <option value={method} selected={method === nodeData.method}>{method}</option>
            {/each}
        </select>
        <span class="small-text">=&gt; {nodeData.dataType}</span>
    </div>
    <div class="arguments-wrapper">
        {#each nodeData.arguments as argument, i (i)}
            <Argument {argLevel} 
                on:innerDrop={(event) => flowDropHandler({ contextName: 'argument', contextType: argument.dataType, stateChangeCallback: dropArgument(i) })(event.detail)}
                onClear={() => onClear(i, argument)}
                returnType={argument.dataType}>

                <!-- <ClearNodeProp onClick={(_) => nodeData.arguments[i] = nodeTemplates[argument.dataType + "Literal"]({})} /> -->
                {#if argument.type === "IdentifierRefCallExpression"}
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
{/if}

<style>
</style>