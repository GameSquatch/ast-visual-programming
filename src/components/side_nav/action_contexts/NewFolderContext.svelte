<script>
    import { navStore } from '../nav_store.js';
    import SingleInputWithSubmit from './SingleInputWithSubmit.svelte';

    export let onDoneCallback;
    let newFolderName = '';

    function submit(_) {
        onDoneCallback(newFolderName);
        navStore.closeContext();
    }
</script>

<div class="wh100 nav-context-wrapper">
    <div class="nav-context-exit-btn">
        <button on:click={(_) => navStore.closeContext()}>X</button>
    </div>
    <p class="input-label">Folder Name</p>
    <SingleInputWithSubmit buttonText={'Add Folder'} bind:inputValue={newFolderName} submitCallback={submit} />
</div>

<style>
    .input-label {
        margin-bottom: 8px;
    }
</style>