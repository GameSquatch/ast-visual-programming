<script setup>
import CallExpression from './CallExpression.vue';
import commonProps from '../../common_ast_props';
import dropDataTemplates from '../../drop_data_templates.js';
import { useStore } from 'vuex';
import { ref } from 'vue';

const props = defineProps({
    ...commonProps,
    expression: Object
});

let isOverInsertSpot = ref(false);

const store = useStore();

function dragOverHandler(event) {
    // do something like change cursor
    event.stopPropagation();
}

/**
 * @param {DragEvent} event
 */
function dropHandler(event) {
    event.stopPropagation();
    const baseLocation = `${props.location}.expression`;

    store.commit('addNode', {toLocation: baseLocation, node: {
        type: "CallExpression",
        location: baseLocation,
        callee: {
            type: "MemberExpression",
            location: `${baseLocation}.callee`,
            object: {
                type: "Identifier",
                location: `${baseLocation}.callee.object`,
                name: "StringUtil"
            },
            property: {
                type: "Identifier",
                location: `${baseLocation}.callee.property`,
                name: "split"
            }
        }
    }});
}

function insertDragOverHandler(event) {
    // something
}
function insertDragEnter(event) {
    isOverInsertSpot.value = true;
}
function insertDragLeave(event) {
    isOverInsertSpot.value = false;
}

function insertDropHandler(event) {
    event.stopPropagation();
    isOverInsertSpot.value = false;
    const dropData = JSON.parse(event.dataTransfer.getData("text/json"));

    const expressionStatement = dropDataTemplates.expressionStatement();
    // Wrap in an expression statement if it's not an expression statement
    if (dropData.type !== "expressionStatement") {
        expressionStatement.expression = dropDataTemplates[dropData.type]();
    }

    const baseLocation = `${props.location}`;
    store.commit('insertNode', { insertAfterLocation: baseLocation, newNode: expressionStatement});
}
</script>

<template>
    <div @dragover.prevent="dragOverHandler" @drop.prevent="dropHandler" class="expression-container">
        <component v-if="expression != null" :is="expression.type" v-bind="expression"></component>
        <p class="dull-text" v-if="expression == null">Drag an action here</p>
    </div>
    <div
        @dragover.prevent="insertDragOverHandler"
        @dragenter.prevent="insertDragEnter"
        @dragleave.prevent="insertDragLeave"
        @drop.prevent="insertDropHandler"
        class="line-down-box"
        :class="{ 'insert-drag-over': isOverInsertSpot }">
    </div>
</template>

<script>
export default {
    components: {
        CallExpression
    }
};
</script>

<style scoped>
.expression-container {
    padding: 35px;
    border: 1px dashed black;
}

.line-down-box {
    margin-left: 20px;
    border-left: 1px dashed black;
    height: 30px;
    /* transition: height 0.5s ease-out; */
}

.insert-drag-over {
    border-left: 2px dashed green;
    transition: height 0.3s ease-out;
    height: 45px;
}
</style>