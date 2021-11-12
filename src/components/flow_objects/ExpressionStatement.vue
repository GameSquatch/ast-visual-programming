<script setup>
import CallExpression from './CallExpression.vue';
import commonProps from '../../common_ast_props';

const props = defineProps({
    ...commonProps,
    expression: Object
});

</script>

<template>
    <div class="expression-container">
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