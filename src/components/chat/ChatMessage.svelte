<script>
    export let msgText;
    export let isMe = false;
</script>

<div class="msg-bubble" class:isMe>{msgText}</div>

<style>
    .msg-bubble {
        padding: 15px;
        border-radius: 10px;
        background-color: #eee;
        width: 100%;
        max-width: 350px;
        margin-bottom: 12px;
    }

    .isMe {
        background-color: #ccc;
    }
</style>