<script>
    import { navStore } from '../nav_store.js';
    import SingleInputWithSubmit from './SingleInputWithSubmit.svelte';

    export let onDoneCallback;

    let newFileName = '';

    function submit(_) {
        onDoneCallback(newFileName);
        navStore.toggleContext();
    }
</script>

<div class="wh100">
    <SingleInputWithSubmit buttonText={'Add File'} bind:inputValue={newFileName} submitCallback={submit} />
</div>