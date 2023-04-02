<script lang="ts">
    import { flowDropHandler } from "../../lib/js/drag_and_drop/drag_and_drop_handlers.js";
    import { fileDataStore } from "../../lib/js/file_data_store.js";
    import { editorStore } from "../tabbed_editor/editor_store.js";
    import { fileMetadata } from "../side_nav/file_metadata.js";
    import { get } from 'svelte/store';
    import { contextMenuStore } from '../../store/context_menu_store.js';
    import { AstNodeCreators } from "../../lib/js/ast_node_creators.js";

    export let dragOverHandler;
    export let nodePath;

    let isOverInsertSpot = false;


    function insertDragEnter(event) {
        isOverInsertSpot = true;
    }
    function insertDragLeave(event) {
        isOverInsertSpot = false;
    }
    function removeInsertHover(event) {
        isOverInsertSpot = false;
    }

    function insertDrop(node) {
        if (node === null) {
            return;
        }

        if (node.dragType === "moveFlowStep") {// node is a dragObject at this point
            fileDataStore.moveFlowStep({ fromPath: node.dragData.flowStepFromPath, toPath: nodePath });
            return;
        }

        fileDataStore.insertNodeIntoFlowAt({ path: nodePath, nodeData: node, append: true });
    }

    function showInsertContextMenu(event) {
        const activeTab = get(editorStore).activeTab;
        const fileReturnType = get(fileMetadata)[activeTab].objectFlowData.returnType;
        const flowStep = AstNodeCreators.flowStep();

        contextMenuStore.update((state) => ({
            showing: true,
            x: event.clientX,
            y: event.clientY,
            menuItems: [
                {
                    title: 'Add Flow Step',
                    onSelected: () => fileDataStore.insertNodeIntoFlowAt({ path: nodePath, nodeData: { ...flowStep }, append: true })
                },
                {
                    title: 'Add If Step',
                    onSelected: () => fileDataStore.insertNodeIntoFlowAt({ path: nodePath, nodeData: AstNodeCreators.ifStatement(), append: true })
                },
                {
                    title: 'Add return statement',
                    onSelected: () => fileDataStore.insertNodeIntoFlowAt({
                        path: nodePath,
                        nodeData: { ...flowStep, expression: AstNodeCreators.returnStatement({ functionId: get(editorStore).activeTab, returnType: fileReturnType }) },
                        append: true
                    })
                }
            ]
        }));
    }
</script>

<div
        on:dragover|preventDefault={dragOverHandler}
        on:dragenter|preventDefault={insertDragEnter}
        on:dragleave|preventDefault={insertDragLeave}
        on:drop|stopPropagation={flowDropHandler({ contextName: 'flow', stateChangeCallback: insertDrop })}
        on:drop|stopPropagation={removeInsertHover}
        on:contextmenu|stopPropagation|preventDefault={showInsertContextMenu}
        class="line-down-box"
        class:insert-drag-over={isOverInsertSpot}
    ></div>

<style>
    .line-down-box {
        margin-left: 20px;
        border-left: 1px dashed black;
        height: 30px;
    }

    .insert-drag-over {
        border-left: 2px dashed green;
        transition: height 0.3s ease-out;
        height: 45px;
    }
</style>