<script lang="ts">
    export let onDragStart: (event: DragEvent) => void;
    export let stopPropagation = false;

    function dragStartHandler(event: DragEvent): void {
        onDragStart(event);
        if (stopPropagation) {
            event.stopPropagation();
        }
    }
</script>

<div draggable="true" on:dragstart={dragStartHandler} style="display:inline-block">
    <slot></slot>
</div>