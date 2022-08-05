<script>
    import { slide } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';
    import { fnInfoRefObjectDrag } from '../lib/js/drag_and_drop/drag_start_data_creators.js';
    import { v4 as uuidv4 } from 'uuid';
    import { fileMetadata } from '../components/side_nav/file_metadata.js';
    import { typeDefaults } from '../lib/js/type_defaults.js';

    export let info;

    // TYPES
    /**
     * @typedef {Object} FunctionRefData
     * @property {string} name
     * @property {string} dataType
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
     * @type {(event: DragEvent, fnRefDragged: FunctionRefData) => void}
     */
    const dragStart = (event, fnRefDragged) => {
        const dragData = fnInfoRefObjectDrag(fnRefDragged);
        event.dataTransfer.setData('text/json', JSON.stringify(dragData));
        isDisplaying = false;
        // Will auto-drop the menu after you've dropped a variable or parameter
        // document.addEventListener('drop', functionInfoDrop, true);
    };

    function functionInfoDrop(event) {
        isDisplaying = true;
        document.removeEventListener('drop', functionInfoDrop, true);
        reShowTimer = setTimeout(tabToggle, 1200);
    }

    function addVariable(_) {
        info.variables = {
            ...info.variables,
            [uuidv4()]: {
                name: 'newVar',
                dataType: 'String',
                defaultValue: ''
            }
        };
    }

    function addParameter(_) {
        fileMetadata.addParameter({
            fnId: info.id,
            parameter: {
                id: uuidv4()
            }
        });
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
            name: newName
        };
    }
    function changeParamRefName(paramId, newName) {
        fileMetadata.changeParameterName({ fnId: info.id, paramId, newName });
    }

    function changeRefType(event, id, infoKey) {
        info[infoKey][id] = {
            ...info[infoKey][id],
            dataType: event.target.value,
            defaultValue: typeDefaults[event.target.value]
        };
    }
    function changeParamRefType(event, id) {
        fileMetadata.changeParameterType({ fnId: info.id, paramId: id, dataType: event.target.value });
    }

    function handleParamDefaultValueChange(event, id, dataType) {
        /** @type {HTMLInputElement} */
        const target = event.target;
        const newValue = dataType === "String" ? event.target.value : target.valueAsNumber;
        fileMetadata.changeParameterDefaultValue({ fnId: info.id, paramId: id, newValue });
    }

    function handleRefDefaultValueChange(event, id, infoKey, dataType) {
        /** @type {HTMLInputElement} */
        const target = event.target;
        const newValue = dataType === "String" ? event.target.value : target.valueAsNumber;
        info[infoKey][id] = {
            ...info[infoKey][id],
            defaultValue: newValue
        };
    }
</script>

<div on:mouseenter={stopTimer} class="absolute w100 tab-floater">
    {#if isDisplaying}
        <div transition:slide={{ duration: 300, easing: quintOut }} class="tab-content">
            <div class="section">
                <div class="return-type-statement">
                    <h4>Return Type:</h4>
                    <select>
                        <option value="Void" selected>Void</option>
                        <option value="String">String</option>
                        <option value="Integer">Integer</option>
                    </select>
                </div>
            </div>

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
                        on:dragstart={(event) =>
                            dragStart(event, {
                                ...varObj,
                                refId: varId,
                                dragType: 'variableRef',
                                fnRefType: 'variables'
                            })}
                        class="flex w100 var-container">
                        <div class="flex col-1">
                            <div class="drag-var" draggable="true" />
                            <input
                                value={varObj.name}
                                type="text"
                                on:change={(e) => changeRefName(varId, e.target.value, 'variables')}
                                class="var-name" />
                        </div>
                        <div class="col-2">
                            <select
                                on:change={(event) => changeRefType(event, varId, 'variables')}
                                value={varObj.dataType}
                                ><option value="String">String</option><option value="Integer">Integer</option></select>
                        </div>
                        <div class="col-3">
                            <input
                                on:change={(event) => handleRefDefaultValueChange(event, varId, 'variables', varObj.dataType)}
                                type={varObj.dataType === 'Integer' ? 'number' : 'text'}
                                value={varObj.defaultValue} />
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
                {#each Object.keys($fileMetadata[info.id].objectFlowData.parameters) as paramId (paramId)}
                    {@const paramObj = $fileMetadata[info.id].objectFlowData.parameters[paramId]}
                    <div
                        on:dragstart={(event) =>
                            dragStart(event, {
                                ...paramObj,
                                refId: paramId,
                                dragType: 'variableRef',
                                fnRefType: 'parameters'
                            })}
                        class="flex w100 var-container">
                        <div class="flex col-1">
                            <div class="drag-var" draggable="true" />
                            <input
                                value={paramObj.name}
                                type="text"
                                on:change={(e) => changeParamRefName(paramId, e.target.value)}
                                class="var-name" />
                        </div>
                        <div class="col-2">
                            <select on:change={(event) => changeParamRefType(event, paramId)} value={paramObj.dataType}
                                ><option value="String">String</option><option value="Integer">Integer</option></select>
                        </div>
                        <div class="col-3">
                            <input
                                on:change={(event) => handleParamDefaultValueChange(event, paramId, paramObj.dataType)}
                                type={paramObj.dataType === 'Integer' ? 'number' : 'text'}
                                value={paramObj.defaultValue} />
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
        <div class:isDisplaying class="tab-toggle" on:click={tabToggle}>{isDisplaying ? '-' : '+'}</div>
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

    .return-type-statement > h4 {
        display: inline;
    }
</style>
