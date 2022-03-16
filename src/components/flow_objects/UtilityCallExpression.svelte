<script>
    import { flowDropHandler } from '../../drag_and_drop_handlers.js'
    import typeDefs from '../../type_definitions.js';
    import ClearNodeProp from '../ClearNodeProp.svelte';
    import Argument from '../Argument.svelte';
    import constructors from '../../constructors.js';
    import nodeTemplates from '../../node_templates.js';

    export let nodeData;
    export let contextType;
    export let isArgument = false;
    export let argLevel = 1;

    const utilities = typeDefs[nodeData.utilityName];

    function onPropertyChange(event) {
        const utilityMethod = event.target.value;
        const typeDef = typeDefs[nodeData.utilityName][utilityMethod];
        const args = typeDef.args.map((argType) => nodeTemplates[argType + "Literal"]({}));

        nodeData = {
            ...nodeData,
            utilityMethod,
            arguments: args,
            returns: typeDef.returns
        };
    };

    // !contextType is when things don't have a type in their parent context
    const matchParentTypeFilter = (methodName) => !contextType || utilities[methodName].returns === contextType;


    const addArgument = (argIndex) => (node) => {
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

<div class="component-wrapper">
    <p><strong>{nodeData.utilityName}</strong></p>
    <div class="method-container">
        <select on:change={onPropertyChange}>
            {#each Object.keys(utilities).filter(matchParentTypeFilter) as method}
                <option value={method} selected={method === nodeData.utilityMethod}>{method}</option>
            {/each}
        </select>
        => {nodeData.returns}
    </div>
    <div class="arguments-wrapper">
        {#each nodeData.arguments as argument, i (i)}
            <Argument {argLevel} 
                on:innerDrop={(event) => flowDropHandler({ contextName: 'argument', contextType: argument.returns, stateChangeCallback: addArgument(i) })(event.detail)}
                onClear={() => onClear(i, argument)}>

                <ClearNodeProp onClick={(_) => nodeData.arguments[i] = nodeTemplates[argument.returns + "Literal"]({})} />
                {#if argument.type === "UtilityCallExpression"}
                    <svelte:self bind:nodeData={argument} argLevel={argLevel + 1} isArgument={true} contextType={argument.returns} />
                {:else}
                    <svelte:component this={constructors[argument.type]} bind:nodeData={argument} argLevel={argLevel + 1} isArgument={true} contextType={argument.returns} />
                {/if}
            </Argument>
        {/each}
    </div>
</div>

<style>
</style>