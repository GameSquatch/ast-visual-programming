<script setup>
import { useStore } from 'vuex';
import commonProps from '../../common_ast_props.js';
import { onUpdated } from 'vue';

const props = defineProps({
    ...commonProps,
    name: String,
    isObject: {
        type: Boolean,
        required: false,
        default: false
    },
    isCalleeProperty: {
        type: Boolean,
        required: false,
        default: false
    }
});

const emit = defineEmits([
    'changeMethod'
]);

const onPropertyChange = (event) => {
    emit('changeMethod', { methodName: event.target.value });
};

onUpdated(() => console.log(`Updated Identifier: ${props.name}`));
</script>

<template>
    <span v-if="!isCalleeProperty">{{ name }}</span>
    <select v-else @change="onPropertyChange">
        <option v-for="method of Object.getOwnPropertyNames(String.prototype)" :value="method" :selected="method == name">{{ method }}</option>
    </select>
</template>