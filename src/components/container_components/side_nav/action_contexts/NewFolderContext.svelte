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
    <SingleInputWithSubmit buttonText={'Add Folder'} bind:inputValue={newFolderName} submitCallback={submit} />
</div>