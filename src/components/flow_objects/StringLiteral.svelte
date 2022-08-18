<script>
    import { mockData } from "../../lib/js/data_json";
    
    export let nodeData;
    export let isArgument = false;
    export let nodePath;

    function updateValue(event) {
        mockData.setNodeAt({ path: `${nodePath}.value`, nodeData: event.target.value });
    }
</script>


<input type="text" value={nodeData.value} on:change={updateValue} />