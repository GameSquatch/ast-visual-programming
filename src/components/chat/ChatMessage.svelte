<script>
    export let msgData;

    const date = new Date(msgData.msgTime);
</script>

<div class="msg-bubble" class:isMe={msgData.isMe}>
    <p class="small">Sender: Connection [{msgData.userId}]</p>
    <p class="msg-text">{msgData.msgText}</p>
    <p class="small">{date.toISOString().replace(/T(.+)\.\d{1,3}Z$/, ' $1')}</p>
</div>

<style>
    .msg-bubble {
        padding: 6px;
        border-radius: 10px;
        background-color: #eee;
        width: 100%;
        max-width: 350px;
        margin-bottom: 12px;
    }
    .msg-text {
        padding: 8px;
    }

    .isMe {
        background-color: #ccc;
    }

    .small {
        font-size: 8pt;
        text-align: right;
    }
</style>