<script>
    import { flowDropHandler } from "../lib/js/drag_and_drop/drag_and_drop_handlers.js";
    import FlowStep from "../components/flow_objects/FlowStep.svelte";
    import { squish } from "../lib/js/custom_animations.js";
    import { flip } from "svelte/animate";
    import { currentFlowData } from './tabbed_editor/editor_store.js';
    import { fileMetadata } from './side_nav/file_metadata.js';
    import mockData from '../lib/js/data_json.js';
    import { StringUtil, IntegerUtil, LoggerUtil, BooleanUtil } from '../lib/js/utility_library.js';

    export let flowData;
    currentFlowData.set(flowData);

    let runOverlayIsVisible = false;
    let runResultText = "";
    let logText = "";

    let hoverPrepend = false;
    function setHoverPrepend(newValue) {
        hoverPrepend = newValue;
    }

    let hoverAppend = false;
    function setHoverAppend(newValue) {
        hoverAppend = newValue;
    }

    /**
     * @param {DragEvent} event
     */
    function dragOverHandler(event) {
        // do stuff like change the cursor
    }

    function prependDrop(node) {
        setHoverPrepend(false);

        if ((node.dragData?.currentIndex ?? false) !== false) {
            flowData.body.splice(node.dragData.currentIndex, 1);
            node = node.nodeData;
        }
        
        flowData.body = [node, ...flowData.body];
    }

    function appendDrop(node) {
        setHoverAppend(false);

        if ((node.dragData?.currentIndex ?? false) !== false) {
            flowData.body.splice(node.dragData.currentIndex, 1);
            node = node.nodeData;
        }

        flowData.body = [...flowData.body, node];
    }

    function handleMoveFlowStep({ dragData, nodeData, newIndex }) {
        if (newIndex === dragData.currentIndex + 1) return;

        flowData.body.splice(dragData.currentIndex, 1);
        newIndex = dragData.currentIndex < newIndex ? newIndex - 1 : newIndex;
        flowData.body.splice(newIndex, 0, nodeData);

        flowData.body = flowData.body;
    }

    function replaceFlowStepContents(index, { oldIndex, newNode }) {
        flowData.body.splice(oldIndex, 1);
        if (index > oldIndex) index--;
        flowData.body[index] = newNode;
    }

    function deleteFlowStep(index) {
        flowData.body.splice(index, 1);
        flowData.body = flowData.body;
    }

    function insertAfterStep(index, dataToInsert) {
        flowData.body.splice(index + 1, 0, dataToInsert);
        flowData.body = flowData.body;
    }

    function moveStep(event, i) {
        const direction = event.detail;
        if (flowData.body.length < 2) return;
        
        if (direction === 'down' && i < flowData.body.length - 1) {
            const [ element ] = flowData.body.splice(i, 1);
            flowData.body.splice(i + 1, 0, element);
        }

        else if (direction === 'up' && i > 0) {
            const [ element ] = flowData.body.splice(i, 1);
            flowData.body.splice(i - 1, 0, element);
        }

        flowData.body = flowData.body;
    }

    async function sendToGenerator() {
        runResultText = "";
        logText = "";

        const strBody = JSON.stringify({
            entryFunctionId: flowData.info.id,
            codeData: mockData,
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

        //let logLines = [];
        textResult.then((codeText) => {
            const logLines = new Function(`const dynamicFunc = (StringUtil, IntegerUtil, LoggerUtil, BooleanUtil) => {'use strict'; const logLines = []; ${codeText}; return logLines; }; return dynamicFunc`)()(StringUtil, IntegerUtil, LoggerUtil, BooleanUtil);
            runResultText = codeText;
            console.log(logLines);
            logText = logLines.join('\n');
        });
    }
</script>

<button on:click={() => runOverlayIsVisible = true} class="run-button">
    <i class="mi-play" />
</button>

<div
    class="flow-wrapper"
    on:dragover|preventDefault={dragOverHandler}
    on:drop|stopPropagation={flowDropHandler({
        contextName: "flow",
        stateChangeCallback: appendDrop,
    })}
>

    <div
        class="bumper-zone"
        class:hoverDrag={hoverPrepend}
        on:drop|stopPropagation={flowDropHandler({
            contextName: "flow",
            stateChangeCallback: prependDrop,
        })}
        on:dragover|preventDefault={dragOverHandler}
        on:dragenter={() => setHoverPrepend(true)}
        on:dragleave={() => setHoverPrepend(false)}
    />

    {#each flowData.body as flowStep, i (flowStep.id)}
        <div
            animate:flip={{ duration: 400 }}
            transition:squish|local={{
                duration: 300,
                opacity: 0.4,
                start: 0.2,
            }}
        >
            <FlowStep
                on:delete={(event) => deleteFlowStep(event.detail)}
                on:replace={(event) =>
                    replaceFlowStepContents(i, { ...event.detail })}
                on:insertAfter={(event) => insertAfterStep(i, event.detail)}
                bind:nodeData={flowStep}
                accessor={i}
                on:moveFlowStep={(event) =>
                    handleMoveFlowStep(event.detail)}
                on:moveStep={(event) => moveStep(event, i)}
                nodePath={`${flowData.info.id}.body.${i}`}
            />
        </div>
        {/each}

    <div
        class="bumper-zone"
        class:hoverDrag={hoverAppend}
        on:dragenter={() => setHoverAppend(true)}
        on:dragleave={() => setHoverAppend(false)}
    />
</div>


<div class="wh100 run-overlay-floater" class:runOverlayIsVisible>
    <div class="run-overlay">
        <h3>Run your function!</h3>
        <p>Parameters</p>
        {#each Object.keys($fileMetadata[flowData.info.id].objectFlowData.parameters) as paramId (paramId)}
            {@const paramData = $fileMetadata[flowData.info.id].objectFlowData.parameters[paramId]}
            <div class="input-wrapper">
                <label>{paramData.name}
                    <input type="{paramData.dataType === 'String' ? 'text' : 'number'}" />
                </label>
            </div>
        {:else}
            <p>This function has no parameters yet</p>
        {/each}
        <div>
            <button on:click={() => sendToGenerator()}>Run</button><button on:click={() => runOverlayIsVisible = false}>Cancel</button>
        </div>

<pre>{runResultText}</pre>

<pre id="log-text">{logText}</pre>
    </div>
</div>

<style>
    .flow-wrapper {
        height: 100%;
        overflow: auto;
        padding: 30px 10px 30px;
        padding-left: 50px;
        position: relative;
        z-index: 1;
    }

    .bumper-zone {
        height: 75px;
    }
    .bumper-zone.hoverDrag {
        background: rgba(255, 255, 255, 0.35);
    }

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
