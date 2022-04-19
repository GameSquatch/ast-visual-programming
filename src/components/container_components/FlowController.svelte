<script>
    import FunctionInfoTab from '../FunctionInfoTab.svelte';
    import { flowDropHandler } from '../../drag_and_drop_handlers.js';
    import ast from '../../store/stores.js';
    import constructors from '../../constructors.js';
    import { squish } from '../../custom_animations.js';
    import { flip } from 'svelte/animate';

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

        if (node.currentIndex !== undefined) {
            $ast.main.body.splice(node.currentIndex, 1);
            node = node.moveData;
        }

        $ast.main.body = [node, ...$ast.main.body];
    }

    function appendDrop(node) {
        setHoverAppend(false);

        if (node.currentIndex !== undefined) {
            $ast.main.body.splice(node.currentIndex, 1);
            node = node.moveData;
        }

        $ast.main.body = [...$ast.main.body, node];
    }

    function handleMoveExpression({ moveData, currentIndex, newIndex }) {
        if (newIndex === currentIndex + 1) return;

        $ast.main.body.splice(currentIndex, 1);
        newIndex = currentIndex < newIndex ? newIndex - 1 : newIndex;
        $ast.main.body.splice(newIndex, 0, moveData);

        $ast.main.body = $ast.main.body;
    }

    function deleteFlowStep(index) {
        $ast.main.body.splice(index, 1);
        $ast.main.body = $ast.main.body;
    }

    function insertAfterStep(index, dataToInsert) {
        $ast.main.body.splice(index + 1, 0, dataToInsert);
        $ast.main.body = $ast.main.body;
    }
</script>
    
<div
on:dragover|preventDefault={dragOverHandler}
on:drop|stopPropagation|preventDefault={flowDropHandler({ contextName: 'flow', stateChangeCallback: appendDrop})}
class="app-window-wrapper">

    <FunctionInfoTab bind:info={$ast.main.info} />

    <div class="flow-wrapper">
        <div class="bumper-zone"
            class:hoverDrag={hoverPrepend}
            on:drop|stopPropagation|preventDefault={flowDropHandler({ contextName: 'flow', stateChangeCallback: prependDrop })}
            on:dragover|preventDefault={dragOverHandler}
            on:dragenter={() => setHoverPrepend(true)}
            on:dragleave={() => setHoverPrepend(false)}></div>
            
        {#each $ast.main.body as flowObject, i (flowObject.id)}
            <div animate:flip="{{duration: 400}}" transition:squish|local="{{duration: 300, opacity: 0.4, start: 0.2}}">
                <svelte:component
                    on:delete={(event) => deleteFlowStep(event.detail)}
                    on:insertAfter={(event) => insertAfterStep(i, event.detail)}
                    this={constructors[flowObject.type]}
                    bind:nodeData={flowObject}
                    accessor={i}
                    on:moveExpression={(event) => handleMoveExpression(event.detail)}
                    nodePath={`ast.main.body.${i}`} />
            </div>
        {/each}

        <div class="bumper-zone"
            class:hoverDrag={hoverAppend}
            on:dragenter={() => setHoverAppend(true)}
            on:dragleave={() => setHoverAppend(false)}></div>
    </div>
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

    .app-window-wrapper {
        position: relative;
        flex: 1;
        background: #efefef;
        z-index: 0;
    }
</style>