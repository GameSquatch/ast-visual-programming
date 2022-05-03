<script>
    import { slide } from "svelte/transition";
    import { quintOut } from "svelte/easing";
    import { functionRefObjectDrag } from "../drag_start_data_creators.js";
    import { v4 as uuidv4 } from "uuid";

    export let info;

    // TYPES
    /**
     * @typedef {Object} FunctionRefData
     * @property {string} name
     * @property {string} returns
     * @property {string|number} value
     * @property {string} [fnRefType]
     */
    // END TYPES

    let isDisplaying = false;
    let reShowTimer = null;

    function tabToggle(_) {
        isDisplaying = !isDisplaying;
    }

    /**
     * @param {FunctionRefData} fnRefDragged
     * @returns {(event: DragEvent) => undefined}
     */
    const dragStart = (fnRefDragged) => (event) => {
        const dragData = functionRefObjectDrag(fnRefDragged);
        event.dataTransfer.setData("text/json", JSON.stringify(dragData));
        isDisplaying = false;
        // Will auto-drop the menu after you've dropped a variable or parameter
        // document.addEventListener('drop', functionInfoDrop, true);
    };

    function functionInfoDrop(event) {
        isDisplaying = true;
        document.removeEventListener("drop", functionInfoDrop, true);
        reShowTimer = setTimeout(tabToggle, 1200);
    }

    function addVariable(_) {
        info.variables = {
            ...info.variables,
            [uuidv4()]: {
                name: "newVar",
                returns: "String",
                value: "",
            },
        };
    }

    function addParameter(_) {
        info.parameters = {
            ...info.parameters,
            [uuidv4()]: {
                name: "newParam",
                returns: "String",
                defaultValue: "",
            },
        };
    }

    function stopTimer(_) {
        if (reShowTimer) {
            clearTimeout(reShowTimer);
            reShowTimer = null;
        }
    }

    function changeRefName(refId, newName, infoKey) {
        info[infoKey][refId] = {
            ...info[infoKey][refId],
            name: newName,
        };
    }

    function varTypeChange(event, id) {
        info.variables[id] = {
            ...info.variables[id],
            returns: event.target.value,
        };
    }
</script>

<div on:mouseenter={stopTimer} class="absolute w100 tab-floater">
    {#if isDisplaying}
        <div
            transition:slide={{ duration: 300, easing: quintOut }}
            class="tab-content"
        >

            <!-- ***** VARIABLE SECTION ***** -->
            <div class="section">
                <h4>Variables</h4>
                <div class="flex var-container">
                    <div class="col-1">Name</div>
                    <div class="col-2">Type</div>
                    <div class="col-3">Default Value</div>
                </div>

                {#each Object.keys(info.variables) as varId (varId)}
                    {@const varObj = info.variables[varId]}
                    <div
                        on:dragstart={dragStart({
                            ...varObj,
                            refId: varId,
                            fnRefType: "variables",
                        })}
                        class="flex w100 var-container"
                    >
                        <div class="flex col-1">
                            <div class="drag-var" draggable="true" />
                            <input
                                value={varObj.name}
                                type="text"
                                on:change={(e) =>
                                    changeRefName(
                                        varId,
                                        e.target.value,
                                        "variables"
                                    )}
                                class="var-name"
                            />
                        </div>
                        <div class="col-2">
                            <select
                                on:change={(event) =>
                                    varTypeChange(event, varId)}
                                value={varObj.returns}
                                ><option value="String">String</option><option
                                    value="Integer">Integer</option
                                ></select
                            >
                        </div>
                        <div class="col-3">
                            <input
                                type={varObj.returns === "Integer"
                                    ? "number"
                                    : "text"}
                                value={varObj.value}
                            />
                        </div>
                    </div>
                {/each}
                <div class="add-var-btn">
                    <button on:click={addVariable}>Add Variable</button>
                </div>
            </div>
            <!-- ***** ***** -->

            <div class="separator-line-horiz" />

            <!-- ***** PARAMETER SECTION ***** -->
            <div class="section">
                <h4>Parameters</h4>
                {#each Object.keys(info.parameters) as paramId (paramId)}
                    {@const paramObj = info.parameters[paramId]}
                    <div
                        draggable="true"
                        on:dragstart={dragStart({
                            ...paramObj,
                            refId: paramId,
                            fnRefType: "parameters",
                        })}
                        class="flex w100 var-container"
                    >
                        <div>
                            <div class="drag-var" draggable="true" />
                            <input
                                value={paramObj.name}
                                type="text"
                                on:change={(e) =>
                                    changeRefName(
                                        paramId,
                                        e.target.value,
                                        "parameters"
                                    )}
                                class="var-name"
                            />
                        </div>
                        <div>
                            <select
                                on:change={(event) =>
                                    varTypeChange(event, paramId)}
                                value={paramObj.returns}
                                ><option value="String">String</option><option
                                    value="Integer">Integer</option
                                ></select
                            >
                        </div>
                        <div>
                            <input
                                type={paramObj.returns === "Integer"
                                    ? "number"
                                    : "text"}
                                value={paramObj.value}
                            />
                        </div>
                    </div>
                {/each}
                <div class="add-var-btn">
                    <button on:click={addParameter}>Add Parameter</button>
                </div>
            </div>
            <!-- ***** ***** -->
        </div>
    {/if}

    <div class="flex justify-center">
        <div class:isDisplaying class="tab-toggle" on:click={tabToggle}>
            Function Info
        </div>
    </div>
</div>

<style>
    .tab-floater {
        --function-info-bg: #444;
        z-index: 2;
        left: 0;
        top: 0;
    }

    .tab-toggle {
        backdrop-filter: blur(3px);
        -webkit-backdrop-filter: blur(3px);
        display: inline-block;
        padding: 4px 10px;
        border-right: 2px solid black;
        border-bottom: 2px solid black;
        border-left: 2px solid black;
        border-radius: 0 0 10px 10px;
        cursor: pointer;
        z-index: 4;
        box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.4);
    }
    .tab-toggle.isDisplaying {
        background: #555;
        color: white;
    }

    .tab-content {
        height: 275px;
        overflow: auto;
        background: var(--function-info-bg);
        color: white;
        box-shadow: 0 2px 8px 4px rgba(0, 0, 0, 0.45);
        z-index: 3;
    }
    .tab-content > .section {
        padding: 12px;
    }

    .drag-var {
        background: #ccc;
        cursor: move;
        width: 20px;
        height: 100%;
        margin-right: 4px;
        display: inline-block;
    }

    .col-1 {
        min-width: 250px;
    }
    .col-2 {
        min-width: 125px;
    }
    .col-3 {
        min-width: 250px;
    }

    /* input {
        width: 80px;
    } */

    .separator-line-horiz {
        height: 2px;
        background-color: #aaa;
        padding: 0 10px;
    }

    .var-container {
        margin-bottom: 5px;
    }
</style>
