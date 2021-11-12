<script setup>
import CallExpression from './CallExpression.vue';
import commonProps from '../../common_ast_props';
import { useStore } from 'vuex';

const props = defineProps({
    ...commonProps,
    expression: Object
});

const store = useStore();

function dragOverHandler(event) {
    // do something like change cursor
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
</script>

<template>
    <div @dragover.prevent="dragOverHandler" @drop.prevent="dropHandler" class="expression-container">
        <component v-if="expression != null" :is="expression.type" v-bind="expression"></component>
        <p class="dull-text" v-if="expression == null">Drag an action here</p>
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
</style>