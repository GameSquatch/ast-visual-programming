<script setup>
import ExpressionStatement from '../flow_objects/ExpressionStatement.vue';
import IfStatement from '../flow_objects/IfStatement.vue';
import dropDataTemplates from '../../drop_data_templates.js';
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const main = computed(() => store.state.ast.main);

/**
 * @param {DragEvent} event
 */
function dragOverHandler(event) {
    // do stuff like change the cursor
}

/**
 * @param {DragEvent} event
 */
function dropHandler(event) {
    const dropData = JSON.parse(event.dataTransfer.getData("text/json"));
    const expressionStatement = dropDataTemplates.expressionStatement();
    console.log(dropData.type);
    if (dropData.type !== "expressionStatement") {
        expressionStatement.expression = dropDataTemplates[dropData.type]();
    }
    store.commit('addNode', {toLocation: `body.${main.value.body.length}`, node: expressionStatement});
}
</script>

<template>
    <div @dragover.prevent="dragOverHandler" @drop.prevent="dropHandler" class="app-window-wrapper">
        <template v-for="(flowObject, indx) of main.body" :key="indx">
            <component :is="flowObject.type" v-bind="flowObject"></component>
        </template>
    </div>
</template>

<script>
export default {
    components: {
        ExpressionStatement,
        IfStatement
    }
};
</script>

<style scoped>
.app-window-wrapper {
    flex: 1;
    overflow: auto;
    background: #efefef;
}
</style>