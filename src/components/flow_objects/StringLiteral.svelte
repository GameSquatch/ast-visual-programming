<script>
    export let parentRef;
    export let accessor;
    export let isArgument;

    $: self = parentRef[accessor];

    function updateValue(event) {
        parentRef[accessor] = {
            ...parentRef[accessor],
            value: event.target.value
        };
    }
</script>


<input type="text" value={self.value} on:change={updateValue} />