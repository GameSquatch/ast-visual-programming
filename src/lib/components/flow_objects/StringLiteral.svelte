<script lang="ts">
    import { fileDataStore } from "../../lib/js/file_data_store";
    
    export let nodeData;
    export let isArgument = false;
    export let nodePath;

    function updateValue(event) {
        fileDataStore.setNodeAt({ path: `${nodePath}.value`, nodeData: event.target.value });
    }
</script>


<input type="text" value={nodeData.value} on:change={updateValue} />