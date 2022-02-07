<script>
    import { createDropNodeFromContext } from '../../drag_and_drop_handlers.js'
    import UtilityDefinitions from '../../utility_definitions.js';
    import constructors from '../../constructors.js';
    import dropDataTemplates from '../../drop_data_templates.js';

    export let parentRef;
    export let accessor;
    export let filterType;

    $: self = parentRef[accessor];
    $: utilities = UtilityDefinitions[self.utilityName];

    // I think I want to not do this and create the arguments via the drop data templates
    if (parentRef[accessor].arguments.length === 0) {
        const s = parentRef[accessor];
        const u = UtilityDefinitions[s.utilityName][s.utilityMethod];
        for (let arg of u.args) {
            s.arguments.push(dropDataTemplates[arg + "Literal"]({}));
        }
    }

    const onPropertyChange = (event) => {
        const utilityMethod = event.target.value;
        const util = utilities[utilityMethod];
        const items = util.args.map((argType) => dropDataTemplates[argType + "Literal"]({}));

        parentRef[accessor] = {
            ...self,
            utilityMethod,
            "arguments": [
                ...items
            ],
            returns: util.returns
        };
    };

    // !filterType is when things don't have a type in their parent context
    const matchParentTypeFilter = (methodName) => !filterType || utilities[methodName].returns === filterType;


    const addArgument = (type, argIndex) => (event) => {
        const node = createDropNodeFromContext('argument', event, type);

        if (node === null) return;

        self.arguments.splice(argIndex, 1, node);
        parentRef[accessor].aruments = [
            ...self.arguments
        ];
    };
</script>

<p style="padding-left: 10px">
    <span>{self.variableName ? self.variableName : self.utilityName}.<select on:change={onPropertyChange}>
        {#each Object.keys(utilities).filter(matchParentTypeFilter) as method}
            <option value={method} selected={method === self.utilityMethod}>{method}</option>
        {/each}
    </select></span>
    (
        {#each self.arguments as argument, i (i)}
            <div on:drop|stopPropagation={addArgument(argument.returns, i)} on:dragover={() => {}} class="arg-box">
                {#if argument.type === "UtilityCallExpression"}
                    <svelte:self accessor={i} bind:parentRef={self.arguments} filterType={argument.returns} />
                {:else}
                    <svelte:component this={constructors[argument.type]} accessor={i} bind:parentRef={self.arguments} isArgument={true} />
                {/if}
            </div>
        {/each}
    )
</p>

<style>
    .arg-box {
        margin-left: 10px;
        padding: 2px;
        border: 1px solid black;
    }
</style>