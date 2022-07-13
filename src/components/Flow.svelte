<script>
    import { flowDropHandler } from "../lib/js/drag_and_drop/drag_and_drop_handlers.js";
    import constructors from "../lib/js/constructors.js";
    import { squish } from "../lib/js/custom_animations.js";
    import { flip } from "svelte/animate";
    import { currentFlowData } from './tabbed_editor/editor_store.js';

    export let flowData;
    currentFlowData.set(flowData);

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

        if (node.dragData?.currentIndex ?? false) {
            flowData.body.splice(node.dragData.currentIndex, 1);
            node = node.nodeData;
            flowData.body = [node, ...flowData.body];
        } else {
            flowData.body = [node, ...flowData.body];
        }
    }

    function appendDrop(node) {
        setHoverAppend(false);

        if (node.dragData?.currentIndex ?? false) {
            flowData.body.splice(node.dragData.currentIndex, 1);
            node = node.nodeData;
            flowData.body = [...flowData.body, node];
        } else {
            flowData.body = [...flowData.body, node];
        }
    }

    function handleMoveExpression({ dragData, nodeData, newIndex }) {
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
</script>

<div
    class="flow-wrapper"
    on:dragover|preventDefault={dragOverHandler}
    on:drop|stopPropagation|preventDefault={flowDropHandler({
        contextName: "flow",
        stateChangeCallback: appendDrop,
    })}
>
    <div
        class="bumper-zone"
        class:hoverDrag={hoverPrepend}
        on:drop|stopPropagation|preventDefault={flowDropHandler({
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
            <svelte:component
                this={constructors[flowStep.type]}
                on:delete={(event) => deleteFlowStep(event.detail)}
                on:replace={(event) =>
                    replaceFlowStepContents(i, { ...event.detail })}
                on:insertAfter={(event) => insertAfterStep(i, event.detail)}
                bind:nodeData={flowStep}
                accessor={i}
                on:moveExpression={(event) =>
                    handleMoveExpression(event.detail)}
                nodePath={`ast.main.body.${i}`}
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

<style>
    .flow-wrapper {
        height: 100%;
        overflow: auto;
        padding-top: 75px;
        padding: 30px 10px 30px;
        z-index: -1;
    }

    .bumper-zone {
        height: 75px;
    }
    .bumper-zone.hoverDrag {
        background: rgba(255, 255, 255, 0.35);
    }
</style>
