<script setup>
import { useStore } from 'vuex';
import commonProps from '../../common_ast_props.js';

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

const store = useStore();

const onPropertyChange = (event) => {
    store.commit('changeMethod', { refObj: props.parentRef.property, methodName: event.target.value });
};
</script>

<template>
    <span v-if="!isCalleeProperty">{{ name }}</span>
    <select v-else @change="onPropertyChange">
        <option v-for="method of Object.getOwnPropertyNames(String.prototype)" :value="method" :selected="method == name">{{ method }}</option>
    </select>
</template>