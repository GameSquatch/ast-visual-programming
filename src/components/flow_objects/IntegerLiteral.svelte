<script>
    export let nodeData;

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