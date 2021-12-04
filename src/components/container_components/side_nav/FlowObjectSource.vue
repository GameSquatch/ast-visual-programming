<script setup>
import { dragStartHandler } from '../../../drag_and_drop_handlers.js';

const props = defineProps({
    dragData: Object
});

const dragStart = dragStartHandler(props.dragData);
</script>

<template>
    <div class="side-nav-tile" draggable="true" @dragstart="dragStart">
        <p><slot></slot></p>
    </div>
</template>