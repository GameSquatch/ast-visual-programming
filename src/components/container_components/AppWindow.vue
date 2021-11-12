<script setup>
import ExpressionStatement from '../flow_objects/ExpressionStatement.vue';
import IfStatement from '../flow_objects/IfStatement.vue';
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const main = computed(() => store.state.ast.main);

/**
 * @param {DragEvent} event
 */
function dragOverHandler(event) {
    event.preventDefault();
}

/**
 * @param {DragEvent} event
 */
function dropHandler(event) {
    event.preventDefault();
    console.log(event.dataTransfer.getData("text/json"));
    store.commit('addNode', {toLocation: `body.${main.value.body.length}`, node: {type: "ExpressionStatement", location: "body.3", "expression": null}});
}
</script>

<template>
    <div @dragover="dragOverHandler" @drop="dropHandler" class="app-window-wrapper">
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