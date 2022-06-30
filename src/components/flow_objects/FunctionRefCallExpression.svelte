<script>
    import FunctionRefIdentifier from '../flow_objects/FunctionRefIdentifier.svelte';
    import Argument from '../Argument.svelte';
    import { flowDropHandler } from '../../lib/js/drag_and_drop/drag_and_drop_handlers.js'
    import typeDefs from '../../lib/js/type_definitions.js';
    import ClearNodeProp from '../ClearNodeProp.svelte';
    import constructors from '../../lib/js/constructors.js';
    import nodeTemplates from '../../lib/js/node_templates.js';

    export let nodeData;
    export let contextType;
    export let isArgument = false;
    export let argLevel = 1;
    export let nodePath;


    let varTypeMethods = typeDefs[nodeData.refData.returns];

    function onPropertyChange(event) {
        const method = event.target.value;
        if (method === '') {
            nodeData = {
                ...(nodeData.refData)
            };
            return;
        }

        const typeDef = varTypeMethods[method];
        const args = typeDef.args.map((argType) => nodeTemplates[argType + "Literal"]({}));

        nodeData = {
            ...nodeData,
            method,
            arguments: args,
            returns: typeDef.returns
        };
    }

    // !contextType is when things don't have a type in their parent context
    const matchParentTypeFilter = (methodName) => !contextType || varTypeMethods[methodName].returns === contextType;


    const dropArgument = (argIndex) => (node) => {
        if (node === null) return;

        nodeData.arguments.splice(argIndex, 1, node);
        nodeData.aruments = [
            ...nodeData.arguments
        ];
    };

    function onClear(i, argument) {
        nodeData.arguments[i] = nodeTemplates[argument.returns + "Literal"]({})
    }
</script>

{#if nodeData.refData}
<div class="component-wrapper">
    <p><strong><FunctionRefIdentifier bind:nodeData={nodeData.refData} isArgument={false} nodePath={nodePath + ".variable"} /></strong></p>
    <div class="method-container">
        <select on:change={onPropertyChange}>
            {#if !contextType || nodeData.refData.returns === contextType}<option value=""></option>{/if}
            {#each Object.keys(varTypeMethods).filter(matchParentTypeFilter) as method}
                <option value={method} selected={method === nodeData.method}>{method}</option>
            {/each}
        </select>
        <span class="small-text">=&gt; {nodeData.returns}</span>
    </div>
    <div class="arguments-wrapper">
        {#each nodeData.arguments as argument, i (i)}
            <Argument {argLevel} 
                on:innerDrop={(event) => flowDropHandler({ contextName: 'argument', contextType: argument.returns, stateChangeCallback: dropArgument(i) })(event.detail)}
                onClear={() => onClear(i, argument)}
                returnType={argument.returns}>

                <ClearNodeProp onClick={(_) => nodeData.arguments[i] = nodeTemplates[argument.returns + "Literal"]({})} />
                {#if argument.type === "VarCallExpression"}
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
{/if}

<style>
</style>