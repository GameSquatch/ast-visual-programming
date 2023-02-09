<script lang="ts">
    import { dragStartHandler } from '../../../lib/js/drag_and_drop/drag_and_drop_handlers.js';
    
    export let dragData;
    
    const dragStart = dragStartHandler(dragData);
</script>
    
<div class="side-nav-tile" draggable="true" on:dragstart={dragStart}>
    <p><slot></slot></p>
</div>