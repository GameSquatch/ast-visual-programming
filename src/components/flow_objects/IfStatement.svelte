<script>
    import constructors from "../../lib/js/constructors.js";
    import { flowDropHandler } from '../../lib/js/drag_and_drop/drag_and_drop_handlers.js';
    import { mockData } from '../../lib/js/data_json.js';
    import { contextMenuStore } from "../../store/context_menu_store.js";
    import nodeTemplates from "../../lib/js/node_templates.js";
    import SubFlow from './SubFlow.svelte';

    export let nodeData;
    export let nodePath;

    function handleDrop(node) {
        if (node === null) {
            return;
        }

        mockData.setNodeAt({ path: `${nodePath}.test`, nodeData: node });
    }


    /**
     * @function
     * @param {Event} event
     */
    function showContextMenu(event) {
        if (nodeData.test.type !== "RefIdentifier") {
            return;
        }

        event.stopPropagation();
        event.preventDefault();
        const menuItems = [{
            title: 'Change to Assignment',
            onSelected: () => {
                const flowStep = nodeTemplates.flowStep();
                flowStep.expression = nodeTemplates.variableRefAssignment({
                    refId: nodeData.test.refId,
                    dataType: 'Boolean',
                    fnRefType: nodeData.test.fnRefType
                });

                mockData.setNodeAt({ path: nodePath, nodeData: flowStep });
            }
        }];
            
        contextMenuStore.update((state) => ({
            showing: true,
            x: event.clientX,
            y: event.clientY,
            menuItems
        }));
    }
</script>


<div on:contextmenu={showContextMenu} class="if-statement-container">
    <div
        on:drop|stopPropagation={flowDropHandler({ contextName: 'argument', contextType: 'Boolean', stateChangeCallback: handleDrop })}
        on:dragover|preventDefault={() => {}}
        class='flow-step-container'
    >
        {#if nodeData.test}
        if
            <svelte:component this={constructors[nodeData.test.type]} nodeData={nodeData.test} nodePath={`${nodePath}.test`} contextType={'Boolean'} />
        {:else}
            <div class="drag-here"><span>Drag Boolean Here</span></div>
        {/if}
    </div>
    
    <div class="flex branches-wrapper">
        <div class="false-flow flex-1">
            else
            <SubFlow nodePath={`${nodePath}.alternate.body`} subFlowBody={nodeData.alternate.body} />
        </div>

        <div class="true-flow flex-1">
            then
            <SubFlow nodePath={`${nodePath}.consequent.body`} subFlowBody={nodeData.consequent.body} />
        </div>
    </div>
</div>

<style>
    .branches-wrapper {
        min-width: 700px;
    }

    .true-flow {
        background: rgba(0, 255, 0, 0.2);
    }
    .false-flow {
        background: rgba(255, 0, 0, 0.2);
    }

    .drag-here {
        padding: 24px 30px;
        border-radius: 10px;
        border: 1px dashed black;
    }
</style>