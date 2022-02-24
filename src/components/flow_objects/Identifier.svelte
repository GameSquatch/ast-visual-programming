<script>
    export let parentRef;
    export let accessor;

    let self = parentRef[accessor];
</script>
    

<span class="self">{self.name}</span>


<style>
    .self {
        padding: 4px 6px;
    }
</style>