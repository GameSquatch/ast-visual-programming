<script setup>
import commonProps from '../../common_ast_props.js';

const props = defineProps({
    ...commonProps,
    test: Object,
    consequent: Object,
    alternate: Object
});
</script>

<template>
    <div>
        If ({{ test.type }}) then {{ consequent.type }} <span v-if="alternate != null">then {{ alternate.type }}</span>
    </div>
</template>