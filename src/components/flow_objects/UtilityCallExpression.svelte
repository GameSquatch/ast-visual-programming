<script>
    import { flowDropHandler } from '../../drag_and_drop_handlers.js'
    import typeDefs from '../../type_definitions.js';
    import ClearNodeProp from '../ClearNodeProp.svelte';
    import constructors from '../../constructors.js';
    import nodeTemplates from '../../node_templates.js';

    export let parentRef;
    export let accessor;
    export let contextType;
    export let isArgument;

    $: self = parentRef[accessor];
    $: utilities = typeDefs[self.utilityName];
    

    const onPropertyChange = (event) => {
        const utilityMethod = event.target.value;
        const typeDef = typeDefs[self.utilityName][utilityMethod];
        const args = typeDef.args.map((argType) => nodeTemplates[argType + "Literal"]({}));

        parentRef[accessor] = {
            ...parentRef[accessor],
            utilityMethod,
            arguments: args,
            returns: typeDef.returns
        };
    };

    // !contextType is when things don't have a type in their parent context
    const matchParentTypeFilter = (methodName) => !contextType || utilities[methodName].returns === contextType;


    const addArgument = (argIndex) => (node) => {
        if (node === null) return;

        self.arguments.splice(argIndex, 1, node);
        parentRef[accessor].aruments = [
            ...self.arguments
        ];
    };
</script>

<p style="padding-left: 10px">
    <span>{self.utilityName}.<select on:change={onPropertyChange}>
        {#each Object.keys(utilities).filter(matchParentTypeFilter) as method}
            <option value={method} selected={method === self.utilityMethod}>{method}</option>
        {/each}
    </select></span>
        {#each self.arguments as argument, i (i)}
            <div on:drop|stopPropagation={flowDropHandler({ contextName: 'argument', contextType: argument.returns, stateChangeCallback: addArgument(i) })} on:dragover={() => {}} class="arg-box">
                <ClearNodeProp onClick={(_) => parentRef[accessor].arguments[i] = nodeTemplates[argument.returns + "Literal"]({})} />
                {#if argument.type === "UtilityCallExpression"}
                    <svelte:self accessor={i} bind:parentRef={self.arguments} contextType={argument.returns} />
                {:else}
                    <svelte:component this={constructors[argument.type]} accessor={i} bind:parentRef={self.arguments} isArgument={true} contextType={argument.returns} />
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