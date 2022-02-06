<script>
    export let parentRef;
    export let accessor;

    $: self = parentRef[accessor];

    /**
     * @param {Event} event
     */
    function updateValue(event) {
        parentRef[accessor] = {
            ...parentRef[accessor],
            value: event.target.valueAsNumber
        };
    }
</script>

<input type="number" value={self.value} on:change={updateValue} />