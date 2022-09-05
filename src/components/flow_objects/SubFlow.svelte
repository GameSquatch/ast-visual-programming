<script>
    import FlowStep from './FlowStep.svelte';
    import IfStatement from './IfStatement.svelte';
    import { flowDropHandler } from '../../lib/js/drag_and_drop/drag_and_drop_handlers.js';
    import { mockData } from '../../lib/js/data_json.js';
    import { squish } from '../../lib/js/custom_animations.js';
    import { flip } from 'svelte/animate';

    export let subFlowBody;
    export let nodePath;


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
            mockData.moveFlowStep({
                fromPath: node.dragData.flowStepFromPath,
                toPath: `${nodePath}.0`,
                insertAt: true
            });
            return;
        }

        mockData.insertNodeIntoFlowAt({ path: `${nodePath}.0`, nodeData: node, spliceIn: true });
    }

    function appendDrop(node) {
        setHoverAppend(false);

        if (node.dragType === 'moveFlowStep') {
            mockData.moveFlowStep({
                fromPath: node.dragData.flowStepFromPath,
                toPath: `${nodePath}.${subFlowBody.length}`,
                insertAt: true
            });
            return;
        }

        mockData.insertNodeIntoFlowAt({ path: `${nodePath}.${subFlowBody.length}`, nodeData: node });
    }

    function moveStep(event, i) {
        const direction = event.detail;
        if (subFlowBody.length < 2) return;

        if (direction === 'down' && i < subFlowBody.length - 1) {
            const [element] = subFlowBody.splice(i, 1);
            subFlowBody.splice(i + 1, 0, element);
        } else if (direction === 'up' && i > 0) {
            const [element] = subFlowBody.splice(i, 1);
            subFlowBody.splice(i - 1, 0, element);
        }

        subFlowBody = subFlowBody;
    }
</script>

<div
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

    {#each subFlowBody as flowStep, i (flowStep.id)}
        {@const path = `${nodePath}.${i}`}
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

    <div
        class="bumper-zone"
        class:hoverDrag={hoverAppend}
        on:dragenter={() => setHoverAppend(true)}
        on:dragleave={() => setHoverAppend(false)} />
</div>

<style>
    .bumper-zone {
        height: 45px;
    }
    .bumper-zone.hoverDrag {
        background: rgba(255, 255, 255, 0.35);
    }
</style>
