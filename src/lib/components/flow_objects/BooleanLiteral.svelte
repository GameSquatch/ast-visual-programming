<script lang="ts">
    import { fileDataStore } from "../../lib/js/file_data_store";
    
    export let nodeData;
    export let isArgument = false;
    export let nodePath;

    function updateValue(event) {
        fileDataStore.setNodeAt({ path: `${nodePath}.value`, nodeData: event.target.checked });
    }
</script>

<input type="checkbox" value={nodeData.value} checked={nodeData.value === true} on:change={updateValue} />