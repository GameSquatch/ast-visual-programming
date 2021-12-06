<script setup>
import commonProps from '../../common_ast_props';

const props = defineProps({
    ...commonProps,
    name: String,
    isObject: {
        type: Boolean,
        required: false,
        default: false
    },
    isProperty: {
        type: Boolean,
        required: false,
        default: false
    }
});
</script>

<template>
    <span v-if="!isProperty">{{ name }}</span>
    <select v-if="isProperty">
        <option v-for="method of Object.getOwnPropertyNames(String.prototype)" :value="method" :selected="method == name">{{ method }}</option>
    </select>
</template>