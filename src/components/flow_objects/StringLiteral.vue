<script setup>
import commonProps from '../../common_ast_props';

const props = defineProps({
    ...commonProps,
    value: String,
    isArgument: {
        type: Boolean,
        required: false,
        default: false
    }
});
</script>

<template>
    <input v-if="isArgument" :value="value" />
    <span v-else>"{{ value }}"</span>
</template>