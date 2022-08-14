<script>
    export let nodeData;
    export let isArgument = false;
    export let nodePath;

    function updateValue(event) {
        nodeData = {
            ...nodeData,
            value: event.target.checked
        };
    }
</script>

<input type="checkbox" value={nodeData.value} checked={nodeData.value === true} on:change={updateValue} />