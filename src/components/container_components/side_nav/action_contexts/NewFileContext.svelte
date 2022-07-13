<script>
    import { navStore } from '../nav_store.js';

    export let onDoneCallback;

    let newFileName = '';

    function submit() {
        onDoneCallback(newFileName);
        navStore.toggleContext();
    }
</script>

<div class="wh100">
<div><input type="text" bind:value={newFileName} /></div>
<button on:click={submit}>Add File</button>
</div>