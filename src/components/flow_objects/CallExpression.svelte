<script>
    import StringLiteral from './StringLiteral.svelte';
    import typeDefs from '../../type_definitions.js';
    import nodeTemplates from '../../node_templates';
    import constructors from '../../constructors.js';

    export let parentRef;
    export let accessor;

    $: self = parentRef[accessor];
    $: utilityDef = self.callee.type === "MemberExpression" ? typeDefs[self.callee.object.name][self.callee.property.name].args : 0;
    
    //const store = useStore();
    const onMethodChange = (payloadObj) => {
        // TODO: commit change to the store using the parentRef from here
        //store.commit('changeMethod', { refObj: parent.value, accessor: props.accessor, ...payloadObj });
        parentRef[accessor] = nodeTemplates.StringUtil(payloadObj.detail.methodName);
    };
    
    //onUpdated(() => console.log(`updated ${defArgNumber()} ${currentRef.value.callee.property.name}`));
</script>


<p style="padding-left: 10px">
    <span>
        <svelte:component on:changeMethod={onMethodChange} isCallee={true} accessor={"callee"} bind:parentRef={self} this={constructors[self.callee.type]} />
        (
            {#each self.arguments as argument, i (i)}
                <div class="arg-box">
                    {#if argument.type === "CallExpression"}
                        <svelte:self accessor={i} bind:parentRef={self.arguments} />
                    {:else}
                        <svelte:component this={constructors[argument.type]} accessor={i} bind:parentRef={self.arguments} isArgument={true} />
                    {/if}
                </div>
            {:else}
                {#each Array(utilityDef) as i}
                    <div class="arg-box">
                        <StringLiteral accessor={i} bind:parentRef={self.arguments} value={""} isArgument={true} />
                    </div>
                {/each}
            {/each}
        )
    </span>
</p>

    
<style>
    .arg-box {
        margin-left: 10px;
        padding: 2px;
        border: 1px solid black;
    }
</style>