<script>
    import VarIdentifier from '../flow_objects/VarIdentifier.svelte';
    import { flowDropHandler } from '../../drag_and_drop_handlers.js'
    import typeDefs from '../../type_definitions.js';
    import ClearNodeProp from '../ClearNodeProp.svelte';
    import constructors from '../../constructors.js';
    import nodeTemplates from '../../node_templates.js';

    export let nodeData;
    export let contextType;
    export let isArgument = false;

    const varTypeMethods = typeDefs[nodeData.variable.returns];
    

    const onPropertyChange = (event) => {
        const method = event.target.value;
        if (method === '') {
            nodeData = {
                ...nodeData.variable
            };
            return;
        }

        const typeDef = typeDefs[nodeData.variable.returns][method];
        const args = typeDef.args.map((argType) => nodeTemplates[argType + "Literal"]({}));

        nodeData = {
            ...nodeData,
            method,
            arguments: args,
            returns: typeDef.returns
        };
    };

    // !contextType is when things don't have a type in their parent context
    const matchParentTypeFilter = (methodName) => !contextType || varTypeMethods[methodName].returns === contextType;


    const dropArgument = (argIndex) => (node) => {
        if (node === null) return;

        nodeData.arguments.splice(argIndex, 1, node);
        nodeData.aruments = [
            ...nodeData.arguments
        ];
    };
</script>

<p style="padding-left: 10px">
    <span><VarIdentifier bind:nodeData={nodeData.variable} isArgument={false} />.<select on:change={onPropertyChange}>
        {#if !contextType || nodeData.variable.returns === contextType}<option value=""></option>{/if}
        {#each Object.keys(varTypeMethods).filter(matchParentTypeFilter) as method}
            <option value={method} selected={method === nodeData.method}>{method}</option>
        {/each}
    </select></span>
        {#each nodeData.arguments as argument, i (i)}
            <div on:drop|stopPropagation={flowDropHandler({ contextName: 'argument', contextType: argument.returns, stateChangeCallback: dropArgument(i) })} on:dragover={() => {}} class="arg-box">
                <ClearNodeProp onClick={(_) => nodeData.arguments[i] = nodeTemplates[argument.returns + "Literal"]({})} />
                {#if argument.type === "UtilityCallExpression"}
                    <svelte:self bind:nodeData={argument} contextType={argument.returns} />
                {:else}
                    <svelte:component this={constructors[argument.type]} bind:nodeData={argument} isArgument={true} contextType={argument.returns} />
                {/if}
            </div>
        {/each}
</p>

<style>
    .arg-box {
        margin-left: 10px;
        padding: 2px;
        border: 1px solid black;
        position: relative;
    }
</style>