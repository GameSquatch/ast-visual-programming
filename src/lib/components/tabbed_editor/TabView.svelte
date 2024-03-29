<script lang="ts">
    import Flow from '../Flow.svelte';
    import FunctionInfoTab from '../FunctionInfoTab.svelte';
    import QuickAccessDraggables from '../QuickAccessDraggables.svelte';
    import { fileDataStore } from '../../lib/js/file_data_store.js';
    import { fileMetadata } from '../side_nav/file_metadata.js';
    import { get } from 'svelte/store';
    import { StringUtil, IntegerUtil, LoggerUtil, BooleanUtil } from '../../lib/js/utility_library.js';

    export let tabViewData;

    let runOverlayIsVisible = false;
    let runResultText = '';
    let logText = '';

    $: inputs = Object.values($fileMetadata[tabViewData.info.id].objectFlowData.parameters).map((paramData) => [
        paramData.defaultValue,
        paramData.dataType
    ]);

    async function sendToGenerator() {
        runResultText = '';
        logText = '';

        const strBody = JSON.stringify({
            entryFunctionId: tabViewData.info.id,
            codeData: get(fileDataStore),
            fileMetadata: $fileMetadata,
            inputs
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
            const logLines = new Function(
                `const dynamicFunc = (StringUtil, IntegerUtil, LoggerUtil, BooleanUtil) => {'use strict'; const executedSteps = []; ${codeText}; const l = [ ...LoggerUtil.logLines ]; LoggerUtil.logLines = []; console.log(executedSteps); return l; }; return dynamicFunc;`
            )()(StringUtil, IntegerUtil, LoggerUtil, BooleanUtil);
            runResultText = codeText;
            logText = logLines.join('\n');
        });
    }

    function updateInputs(event, paramType, i) {
        inputs[i] = [
            paramType === 'Integer'
                ? event.target.valueAsNumber
                : paramType === 'Boolean'
                ? event.target.checked
                : event.target.value,
            paramType
        ];
    }

    function showRunOverlay() {
        runOverlayIsVisible = true;
        sendToGenerator();
    }
</script>

<FunctionInfoTab info={tabViewData.info} />
<QuickAccessDraggables functionInfo={tabViewData.info} />

<button on:click={() => showRunOverlay()} class="run-button"
    ><svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="svg-icon-size">
        <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
    </svg>
</button>

<Flow flowData={tabViewData} />

<div class="wh100 run-overlay-floater" class:runOverlayIsVisible>
    <div class="flex-col run-overlay">
        <h3>Run your function!</h3>
        {#if Object.keys($fileMetadata[tabViewData.info.id].objectFlowData.parameters).length > 0}
            <p>Parameters</p>
            {#each Object.keys($fileMetadata[tabViewData.info.id].objectFlowData.parameters) as paramId, i (paramId)}
                {@const paramData = $fileMetadata[tabViewData.info.id].objectFlowData.parameters[paramId]}
                <div class="input-wrapper">
                    <label
                        >{paramData.name}
                        <input
                            value={paramData.defaultValue}
                            checked={paramData.defaultValue === true}
                            on:change={(event) => updateInputs(event, paramData.dataType, i)}
                            type={paramData.dataType === 'String'
                                ? 'text'
                                : paramData.dataType === 'Boolean'
                                ? 'checkbox'
                                : 'number'} />
                    </label>
                </div>
            {/each}
        {/if}

        <div class="flex-1">
            <pre>{runResultText}</pre>
            <div class="log-text-container">
                <pre>{#if logText}{logText}{:else}// Use the LoggerUtil to view data{/if}</pre>
            </div>
        </div>

        <div>
            <button on:click={() => sendToGenerator()}>Run</button><button
                on:click={() => (runOverlayIsVisible = false)}>Cancel</button>
        </div>
    </div>
</div>

<style>
    .run-button {
        position: absolute;
        padding: 3px;
        top: 25px;
        left: 20px;
        z-index: 2;
        display: flex;
        align-items: center;
    }

    .run-overlay-floater {
        position: absolute;
        top: 0;
        left: 0;
        backdrop-filter: blur(2px);
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 5;
    }
    .run-overlay-floater.runOverlayIsVisible {
        display: flex;
    }

    .run-overlay {
        width: 60%;
        height: 80%;
        background: white;
        border-radius: 12px;
        padding: 15px;
    }

    .log-text-container {
        background: #222;
        color: greenyellow;
        padding: 10px;
        border-radius: 10px;
        border: 2px solid #666;
        margin-top: 15px;
    }

    .svg-icon-size {
        width: 28px;
        height: auto;
    }
</style>
