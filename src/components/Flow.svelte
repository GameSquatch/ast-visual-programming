<script>
    import { flowDropHandler } from '../lib/js/drag_and_drop/drag_and_drop_handlers.js';
    import FlowStep from '../components/flow_objects/FlowStep.svelte';
    import IfStatement from '../components/flow_objects/IfStatement.svelte';
    import { squish } from '../lib/js/custom_animations.js';
    import { flip } from 'svelte/animate';
    import { mockData } from '../lib/js/data_json.js';

    export let flowData;

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

        if (node.dragType === 'moveFlowStep') {
            mockData.moveFlowStep({ fromPath: node.dragData.flowStepFromPath, toPath: `${flowData.info.id}.body.0`, insertAt: true });
            return;
        }

        mockData.insertNodeIntoFlowAt({ path: `${flowData.info.id}.body.0`, nodeData: node, spliceIn: true });
    }

    function appendDrop(node) {
        setHoverAppend(false);

        if (node.dragType === 'moveFlowStep') {
            mockData.moveFlowStep({ fromPath: node.dragData.flowStepFromPath, toPath: `${flowData.info.id}.body.${flowData.body.length}`, insertAt: true });
            return;
        }

        mockData.insertNodeIntoFlowAt({ path: `${flowData.info.id}.body.${flowData.body.length}`, nodeData: node });
    }

    function moveStep(event, i) {
        const direction = event.detail;
        if (flowData.body.length < 2) return;

        if (direction === 'down' && i < flowData.body.length - 1) {
            const [element] = flowData.body.splice(i, 1);
            flowData.body.splice(i + 1, 0, element);
        } else if (direction === 'up' && i > 0) {
            const [element] = flowData.body.splice(i, 1);
            flowData.body.splice(i - 1, 0, element);
        }

        flowData.body = flowData.body;
    }
</script>


<div
    class="flow-wrapper"
    on:dragover|preventDefault={dragOverHandler}
    on:drop|stopPropagation={flowDropHandler({
        contextName: 'flow',
        stateChangeCallback: appendDrop
    })}>
    <div
        class="bumper-zone"
        class:hoverDrag={hoverPrepend}
        on:drop|stopPropagation={flowDropHandler({
            contextName: 'flow',
            stateChangeCallback: prependDrop
        })}
        on:dragover|preventDefault={dragOverHandler}
        on:dragenter={() => setHoverPrepend(true)}
        on:dragleave={() => setHoverPrepend(false)} />

    <!-- #key removes transition animation when switching tabs -->
    {#key flowData.info.id}
        {#each flowData.body as flowStep, i (flowStep.id)}
            {@const path = `${flowData.info.id}.body.${i}`}
            <div
                animate:flip={{ duration: 400 }}
                transition:squish|local={{
                    duration: 300,
                    opacity: 0.4,
                    start: 0.2
                }}>
            {#if flowStep.type === 'IfStatement'}
                <IfStatement
                    nodeData={flowStep}
                    nodePath={path} />
            {:else}
                <FlowStep
                    nodeData={flowStep}
                    accessor={i}
                    on:moveStep={(event) => moveStep(event, i)}
                    nodePath={path} />
            {/if}
            </div>
        {/each}
    {/key}

    <div
        class="bumper-zone"
        class:hoverDrag={hoverAppend}
        on:dragenter={() => setHoverAppend(true)}
        on:dragleave={() => setHoverAppend(false)} />
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
</style>
