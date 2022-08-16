<script>
    import { routes } from '../store/routes.js';
    import { mockData } from '../lib/js/data_json.js';
    import { fileMetadata } from '../components/side_nav/file_metadata.js';
    import { StringUtil, IntegerUtil, LoggerUtil } from '../lib/js/utility_library.js';
    import { get } from 'svelte/store';

    $: fnKeys = Object.keys(get(mockData)).filter((fileKey) => $fileMetadata[fileKey].fileType === 'function');

    /** @type {Promise<string>|null} */
    let generatingPromise = null;
    let entryFunctionId = '';
    let validationMessage = '';

    function onChangeHandler(event) {
        entryFunctionId = event.target.value;
    }

    function handleGenerateButtonClick(_) {
        generatingPromise = null;
        
        if (entryFunctionId === '') {
            validationMessage = 'You need to choose an entry function first';
            return;
        }

        validationMessage = '';
        generatingPromise = sendToGenerator();
    }

    async function sendToGenerator() {
        const strBody = JSON.stringify({
            entryFunctionId,
            codeData: get(mockData),
            fileMetadata: $fileMetadata
        });

        const response = await fetch('/api/generate-code', {
            body: strBody,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const textResult = response.text();

        textResult.then((codeText) => {
            new Function(`const dynamicFunc = (StringUtil, IntegerUtil, LoggerUtil) => {'use strict'; console.log('running dynamic function'); ${codeText}}; return dynamicFunc`)()(StringUtil, IntegerUtil, LoggerUtil);
        });

        return textResult;
    }

    function flowButtonClick(_) {
        history.pushState({}, '', '/app');
        $routes = '/app';
    }
</script>

<div class="run-header">
    <h1>Run Page</h1>
    <button class=" light-bg-btn" on:click={flowButtonClick}>Flow</button>
</div>

<main>
    <div>
        <label>
            Select Entry Function
            <select on:change={onChangeHandler}>
                <option value="" selected />
                {#each fnKeys as fnKey (fnKey)}
                    {@const fm = $fileMetadata[fnKey]}
                    <option value={fnKey}>{fm.title}</option>
                {/each}
            </select>
        </label>
    </div>
    <div class="generate-btn">
        <button on:click={handleGenerateButtonClick}>Generate Code</button>
    </div>

    <div class="code-text-container">
        <p class="validation-msg">{validationMessage}</p>
        {#if generatingPromise !== null}
            {#await generatingPromise}
                ...generating code server side
            {:then codeText}
                <pre>{codeText}</pre>
            {/await}
        {/if}
    </div>
</main>

<style>
    select {
        display: block;
    }

    .run-header {
        display: flex;
        justify-content: space-between;
    }

    .generate-btn {
        margin: 8px 0;
    }

    .code-text-container {
        padding: 12px;
    }

    .validation-msg {
        color: red;
    }
</style>
