<script>
    import VarIdentifier from '../flow_objects/VarIdentifier.svelte';
    import { flowDropHandler } from '../../drag_and_drop_handlers.js'
    import typeDefs from '../../type_definitions.js';
    import ClearNodeProp from '../ClearNodeProp.svelte';
    import constructors from '../../constructors.js';
    import dropDataTemplates from '../../drop_data_templates.js';

    export let parentRef;
    export let accessor;
    export let filterType;
    export let isArgument;

    $: self = parentRef[accessor];
    $: varTypeMethods = typeDefs[self.variableName.returns];
    

    const onPropertyChange = (event) => {
        const method = event.target.value;
        if (method === '') {
            parentRef[accessor] = {
                ...self.variableName
            };
            return;
        }

        const typeDef = typeDefs[self.variableName.returns][method];
        const args = typeDef.args.map((argType) => dropDataTemplates[argType + "Literal"]({}));

        parentRef[accessor] = {
            ...parentRef[accessor],
            method,
            arguments: args,
            returns: typeDef.returns
        };
    };

    // !filterType is when things don't have a type in their parent context
    const matchParentTypeFilter = (methodName) => !filterType || varTypeMethods[methodName].returns === filterType;


    const dropArgument = (argIndex) => (node) => {
        if (node === null) return;

        self.arguments.splice(argIndex, 1, node);
        parentRef[accessor].aruments = [
            ...self.arguments
        ];
    };
</script>

<p style="padding-left: 10px">
    <span><VarIdentifier bind:parentRef={self} accessor={"variableName"} isArgument={false} />.<select on:change={onPropertyChange}>
        <option value=""></option>
        {#each Object.keys(varTypeMethods).filter(matchParentTypeFilter) as method}
            <option value={method} selected={method === self.method}>{method}</option>
        {/each}
    </select></span>
        {#each self.arguments as argument, i (i)}
            <div on:drop|stopPropagation={flowDropHandler({ contextName: 'argument', contextType: argument.returns, stateChangeCallback: dropArgument(i) })} on:dragover={() => {}} class="arg-box">
                <ClearNodeProp onClick={(_) => parentRef[accessor].arguments[i] = dropDataTemplates[argument.returns + "Literal"]({})} />
                {#if argument.type === "UtilityCallExpression"}
                    <svelte:self accessor={i} bind:parentRef={self.arguments} filterType={argument.returns} />
                {:else}
                    <svelte:component this={constructors[argument.type]} accessor={i} bind:parentRef={self.arguments} isArgument={true} />
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