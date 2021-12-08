<script setup>
import commonProps from '../../common_ast_props';
import Identifier from './Identifier.vue';

const props = defineProps({
    ...commonProps,
    object: Object,
    property: Object,
    isCallee: {
        type: Boolean,
        required: false,
        default: false
    }
});
</script>

<template>
    <span><component :accessor="'object'" :parent-ref="parentRef[accessor]" :is="object.type" v-bind="object" :is-object="true"></component>.<component :accessor="'property'" :parent-ref="parentRef[accessor]" :is="property.type" v-bind="property" :is-callee-property="isCallee"></component></span>
</template>

<script>
export default {
    components: {
        Identifier
    }
}
</script>