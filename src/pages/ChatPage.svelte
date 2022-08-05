<script>
    import { onMount } from 'svelte';
    import { connectToChat } from '../../server/socket/chat_sock.js';
    import ChatMessage from '../components/chat/ChatMessage.svelte';

    let msgs = [];
    let isConnected = false;
    let socket;
    let msgInput;
    
    onMount(() => {
        socket = connectToChat();

        socket.on('chat msg', (msg) => {
            msgs.push({ msg: msg.msg, isMe: (msg.userId === socket.id) });
            msgs = msgs;
        });

        socket.on('connected', () => {
            isConnected = true;
        });

        socket.on('disconnected', () => {
            isConnected = false;
            socket = undefined;
        });
    });


    function sendMessage() {
        if (msgInput.value) {
            socket.emit('chat msg', msgInput.value);
            msgInput.value = "";
        }
    }
</script>

<div class="page-wrapper h100">
    <div class="flex-col h100">
        <div class="flex">
            <div class="connected-indicator" style="background-color:{isConnected ? 'green' : 'red'}"></div>
            <p>{isConnected ? 'Connected' : 'Not Connected'}</p>
        </div>
        <div class="msg-container flex-1">
            {#each msgs as msg}
                <ChatMessage isMe={msg.isMe} msgText={msg.msg} />
            {/each}
        </div>
        <form on:submit|preventDefault={sendMessage} class="flex">
            <input bind:this={msgInput} class="flex-1" type="text" />
            <button type="submit">Send</button>
        </form>
    </div>
</div>

<style>
    .msg-container {
        padding: 15px;
    }
    .page-wrapper {
        position: relative;
    }
    .connected-indicator {
        height: 25px;
        width: 25px;
        border-radius: 50%;
        margin-right: 20px;
    }
</style>