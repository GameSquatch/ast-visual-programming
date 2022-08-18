<script>
    import { mockData } from "../../lib/js/data_json";

    export let nodeData;
    export let isArgument = false;
    export let nodePath;

    /**
     * @param {Event} event
     */
    function updateValue(event) {
        mockData.setNodeAt({ path: `${nodePath}.value`, nodeData: event.target.valueAsNumber });
    }
</script>

<input type="number" value={nodeData.value} on:change={updateValue} />