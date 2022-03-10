<script>
    export let nodeData;
    export let isArgument;

    function updateValue(event) {
        nodeData = {
            ...nodeData,
            value: event.target.value
        };
    }
</script>


<input type="text" value={nodeData.value} on:change={updateValue} on:dragStart|stopPropagation={() => {}} />