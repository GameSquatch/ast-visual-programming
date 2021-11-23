<script setup>
const props = defineProps({
    dragData: Object
});

/**
 * @param {DragEvent} event
 */
function dragStartHandler(event) {
    event.dataTransfer.setData("text/json", JSON.stringify(props.dragData));
    event.dataTransfer.dropEffect = "copy";
}
</script>

<template>
    <div class="utility-object-tile" draggable="true" @dragstart="dragStartHandler">
        <p><slot></slot></p>
    </div>
</template>