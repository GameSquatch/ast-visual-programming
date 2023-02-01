<script>
    import { navStore } from '../nav_store.js';
    import SingleInputWithSubmit from './SingleInputWithSubmit.svelte';

    /** @type {ContextDoneCallback} */
    export let onDoneCallback;

    let newFileName = '';
    let selectElem;

    function submit(_) {
        onDoneCallback(newFileName, selectElem.value);
        navStore.closeContext();
    }
</script>

<div class="wh100 nav-context-wrapper">
    <div class="nav-context-exit-btn">
        <button on:click={(_) => navStore.closeContext()}>X</button>
    </div>
    <label for="file-type-select">
        File Type:
        <select id="file-type-select" bind:this={selectElem}>
            <option value="function" selected>Function</option>
        </select>
    </label>
    <SingleInputWithSubmit buttonText={'Add File'} bind:inputValue={newFileName} placeholder={'File Name'} submitCallback={submit} />
</div>

<style>
    [for="file-type-select"] {
        display: block;
        margin-bottom: 8px;
    }
</style>