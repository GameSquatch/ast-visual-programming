<script lang="ts">
    import { fileDataStore } from "../../lib/js/file_data_store";

    export let nodeData;
    export let isArgument = false;
    export let nodePath;

    /**
     * @param {Event} event
     */
    function updateValue(event) {
        fileDataStore.setNodeAt({ path: `${nodePath}.value`, nodeData: event.target.valueAsNumber });
    }
</script>

<input type="number" value={nodeData.value} on:change={updateValue} />