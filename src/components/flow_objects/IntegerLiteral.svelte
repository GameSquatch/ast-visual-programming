<script>
    export let nodeData;
    export let isArgument = false;
    export let nodePath;

    /**
     * @param {Event} event
     */
    function updateValue(event) {
        nodeData = {
            ...nodeData,
            value: event.target.valueAsNumber
        };
    }
</script>

<input type="number" value={nodeData.value} on:change={updateValue} />