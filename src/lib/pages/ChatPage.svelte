<script lang="ts">
    // import { onMount, onDestroy } from 'svelte';
    // import { connectToChat } from '../../server/socket/chat_sock.js';
    import ChatMessage from '../components/chat/ChatMessage.svelte';

    let msgs = [];
    let isConnected = false;
    let socket;
    let msgInput;
    let userIsTyping = false;
    let userCount = 0;
    
    // onMount(() => {
    //     socket = connectToChat();

    //     socket.on('chat msg', (msg) => {
    //         msgs.push({ ...msg, isMe: (msg.userId === socket.id) });
    //         msgs = msgs;
    //     });

        
    //     socket.on('historical msgs', (history) => {
    //         msgs = [ ...msgs, ...history.msgs.map((msgData) => ({ ...msgData, isMe: (msgData.userId === socket.id) })) ];
    //     });
        
    //     let typingTimer = null;
    //     socket.on('user typing', (userId) => {
    //         if (userId !== socket.id) {
    //             userIsTyping = true;
    //             if (typingTimer !== null) {
    //                 clearTimeout(typingTimer);
    //                 typingTimer = null;
    //             }

    //             typingTimer = setTimeout(() => {
    //                 typingTimer = null;
    //                 userIsTyping = false;
    //             }, 2000);
    //         }
    //     });

    //     socket.on('connect', () => {
    //         isConnected = true;
    //     });

    //     socket.on('disconnect', () => {
    //         isConnected = false;
    //         msgs = [];
    //     });

    //     socket.on('user count', (count) => {
    //         // subtract one for yourself
    //         userCount = count - 1;
    //     });
    // });

    // onDestroy(() => {
    //     socket?.disconnect();
    // });


    function sendMessage() {
        const now = Date.now();

        if (msgInput.value && isConnected) {
            // socket.emit('chat msg', { msgText: msgInput.value, msgTime: now, userId: socket.id });
            msgInput.value = "";
        }
    }

    function userTyping() {
        let timer = null;

        return (_) => {
            if (timer !== null) return;

            timer = setTimeout(() => {
                // socket.emit('user typing', socket.id);
                timer = null;
            }, 40);
        };
    }
</script>

<div class="page-wrapper h100">
    <div class="flex-col h100">
        <div class="flex">
            <div class="connected-indicator" style="background-color:{isConnected ? 'green' : 'red'}"></div>
            <p>{isConnected ? `Connected with ${userCount} other user(s)` : 'Not Connected'}</p>
        </div>
        <div class="msg-container flex-1">
            {#each msgs as msgData (msgData.msgTime)}
                <ChatMessage {msgData} />
            {/each}
        </div>
        <p class="user-typing">{userIsTyping ? 'Someone is typing...' : ''}</p>
        <form on:submit|preventDefault={sendMessage} class="flex send-form">
            <input on:input={userTyping()} bind:this={msgInput} class="flex-1" type="text" />
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

    .send-form {
        padding: 12px;
    }
</style>