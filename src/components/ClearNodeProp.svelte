<script>
    export let onClick;
</script>

<button class="delete-btn" on:click={onClick}>X</button>


<style>
    .delete-btn {
        position: absolute;
        right: 0;
        top: 0;
        background: red;
        color: white;
        padding: 1px;
        margin: 0;
    }
</style>