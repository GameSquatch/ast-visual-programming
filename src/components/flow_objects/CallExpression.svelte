<script>
    import MemberExpression from './MemberExpression.svelte';
    import Identifier from './Identifier.svelte';
    import StringLiteral from './StringLiteral.svelte';
    import UtilityDefinitions from '../../utility_definitions.js';

    export let parentRef;
    export let accessor;

    //console.log(callee);

    const constructors = {
        "MemberExpression": MemberExpression,
        "Identifier": Identifier,
        "StringLiteral": StringLiteral
    };

    let self = parentRef[accessor];
    
    let defArgNumber = () => UtilityDefinitions[self.callee.object.name][self.callee.property.name].args;
    
    //const store = useStore();
    const onMethodChange = (payloadObj) => {
        // TODO: commit change to the store using the parentRef from here
        //store.commit('changeMethod', { refObj: parent.value, accessor: props.accessor, ...payloadObj });
    };
    
    //onUpdated(() => console.log(`updated ${defArgNumber()} ${currentRef.value.callee.property.name}`));
</script>


<p style="padding-left: 10px">
    <span>
        <svelte:component isCallee={true} accessor={"callee"} bind:parentRef={self} this={constructors[self.callee.type]} />
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
                {#each defArgNumber() as i}
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