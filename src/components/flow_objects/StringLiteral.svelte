<script>
    export let nodeData;
    export let isArgument = false;
    export let nodePath;

    function updateValue(event) {
        nodeData = {
            ...nodeData,
            value: event.target.value
        };
    }
</script>


<input type="text" value={nodeData.value} on:change={updateValue} />