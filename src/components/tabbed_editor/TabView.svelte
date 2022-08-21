<script>
    import Flow from '../Flow.svelte';
    import FunctionInfoTab from '../FunctionInfoTab.svelte';
	import QuickAccessDraggables from '../QuickAccessDraggables.svelte';
    import { mockData } from '../../lib/js/data_json.js';
    import { fileMetadata } from '../side_nav/file_metadata.js';
    import { get } from 'svelte/store';
    import { StringUtil, IntegerUtil, LoggerUtil, BooleanUtil } from '../../lib/js/utility_library.js';

    export let tabViewData;

    let runOverlayIsVisible = false;
    let runResultText = '';
    let logText = '';

    $: inputs = Object.values($fileMetadata[tabViewData.info.id].objectFlowData.parameters).map(
        (paramData) => [ paramData.defaultValue, paramData.dataType ]
    );

    async function sendToGenerator() {
        runResultText = '';
        logText = '';

        const strBody = JSON.stringify({
            entryFunctionId: tabViewData.info.id,
            codeData: get(mockData),
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
                `const dynamicFunc = (StringUtil, IntegerUtil, LoggerUtil, BooleanUtil) => {'use strict'; ${codeText}; const l = [ ...LoggerUtil.logLines ]; LoggerUtil.logLines = []; return l; }; return dynamicFunc;`
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

<FunctionInfoTab bind:info={tabViewData.info} />
<QuickAccessDraggables functionInfo={tabViewData.info} />

<button on:click={() => showRunOverlay()} class="run-button">
    <i class="mi-play" />
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
            <pre>{logText}</pre>
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
        padding: 5px;
        top: 25px;
        left: 20px;
        font-size: 14pt;
        z-index: 2;
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
</style>
