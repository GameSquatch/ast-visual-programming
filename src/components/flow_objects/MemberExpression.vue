<script setup>
import commonProps from '../../common_ast_props';
import Identifier from './Identifier.vue';

const props = defineProps({
    ...commonProps,
    object: Object,
    property: Object
});
</script>

<template>
    <span><component :is="object.type" v-bind="object" :is-object="true"></component>.<component :is="property.type" v-bind="property" :is-property="true"></component></span>
</template>

<script>
export default {
    components: {
        Identifier
    }
}
</script>