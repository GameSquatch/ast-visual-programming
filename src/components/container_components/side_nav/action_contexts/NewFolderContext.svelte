<script>
    import { navStore } from '../nav_store.js';
    import SingleInputWithSubmit from './SingleInputWithSubmit.svelte';

    export let onDoneCallback;
    let newFolderName = '';

    function submit(_) {
        onDoneCallback(newFolderName);
        navStore.toggleContext();
    }
</script>

<div class="wh100">
    <div class="t-align-right exit-btn">
        <button on:click={(_) => navStore.toggleContext()}>X</button>
    </div>
    <SingleInputWithSubmit buttonText={'Add Folder'} bind:inputValue={newFolderName} submitCallback={submit} />
</div>


<style>
    .exit-btn {
        margin-bottom: 8px;
    }
</style>