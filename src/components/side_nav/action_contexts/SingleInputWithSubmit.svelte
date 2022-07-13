<script>
    import { requestFocus } from './use_request_focus.js';
    import { onEnterKeyHandler } from './enter_key_handler.js';

    export let inputValue;
    export let submitCallback;
    export let buttonText;
</script>

<div class="single-input-wrapper">
    <input class="single-input" on:keyup={(event) => onEnterKeyHandler(event, submitCallback)} use:requestFocus type="text" bind:value={inputValue} />
</div>
<button on:click={submitCallback}>{buttonText}</button>

<style>
    .single-input-wrapper {
        margin-bottom: 6px;
    }

    .single-input {
        width: 100%;
    }
</style>