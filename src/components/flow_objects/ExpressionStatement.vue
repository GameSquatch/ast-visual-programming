<script setup>
import CallExpression from './CallExpression.vue';
import commonProps from '../../common_ast_props.js';
//import dropDataTemplates from '../../drop_data_templates.js';
import { dropNewObjectHandler, dropModifyObjectHandler } from '../../drag_and_drop_handlers.js';
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
    //event.stopPropagation();
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
function removeInsertHover(event) {
    isOverInsertSpot.value = false;
}

const modifyDrop = dropModifyObjectHandler({ toLocation: `${props.location}.expression` });
const insertDrop = dropNewObjectHandler('insertNode', { insertAfterLocation: `${props.location}` });
</script>

<template>
    <div @dragover.prevent="dragOverHandler" @drop.stop.prevent="modifyDrop" class="expression-container">
        <component v-if="expression != null" :is="expression.type" v-bind="expression"></component>
        <p class="dull-text" v-if="expression == null">Drag an action here</p>
    </div>
    <div
        @dragover.prevent="insertDragOverHandler"
        @dragenter.prevent="insertDragEnter"
        @dragleave.prevent="insertDragLeave"
        @drop.stop.prevent="insertDrop($event), removeInsertHover($event)"
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