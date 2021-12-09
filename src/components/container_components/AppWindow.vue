<script setup>
import ExpressionStatement from '../flow_objects/ExpressionStatement.vue';
import IfStatement from '../flow_objects/IfStatement.vue';
import { dropInsertHandler } from '../../drag_and_drop_handlers.js';
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const ast = computed(() => store.state.ast);

/**
 * @param {DragEvent} event
 */
function dragOverHandler(event) {
    // do stuff like change the cursor
}

const appendDrop = (event) => {
    dropInsertHandler({ refObj: ast.value.main.body, accessor: `${ast.value.main.body.length}`})(event);
}
</script>

<template>
    <div @dragover.prevent="dragOverHandler" @drop.stop.prevent="appendDrop" class="app-window-wrapper">
        <template v-for="(flowObject, indx) of ast.main.body" :key="indx">
            <component :is="flowObject.type" v-bind="flowObject" :accessor="indx.toString()" :parent-ref="ast.main.body"></component>
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