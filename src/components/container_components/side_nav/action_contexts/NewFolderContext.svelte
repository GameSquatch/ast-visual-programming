<script>
    import { navStore } from '../nav_store.js';

    export let onDoneCallback;
    let newFolderName = '';

    function submit() {
        onDoneCallback(newFolderName);
        navStore.toggleContext();
    }
</script>

<div class="wh100">
<div><input type="text" bind:value={newFolderName} /></div>
<button on:click={submit}>Add Folder</button>
</div>