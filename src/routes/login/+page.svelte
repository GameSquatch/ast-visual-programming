<script lang="ts">
    import { loginCanvas } from './login_canvas';
	import type { ActionData } from "./$types";

    export let form: ActionData;
</script>

<div class="wrapper">
    <canvas class="canvas" use:loginCanvas></canvas>

    <div class="form-wrapper">
        <form class="form" method="POST">
            <h2 style="text-align:center">ZFlow</h2>
            <input name="username" type="text" placeholder="username" />
            <input name="password" type="text" placeholder="password" />
            <button>Login</button>
            {#if form?.msg}
                <p style="color:red">{form?.msg}</p>
            {/if}
        </form>
    </div>
</div>

<style>
    .wrapper {
        position: relative;
        z-index: 0;
        padding: 0;
        margin: 0;
    }

    .canvas {
        position: absolute;
        z-index: -1;
        top: 0;
        left: 0;
    }

    .form-wrapper {
        display: flex;
        width: 100vw;
        height: 100vh;
        justify-content: center;
        align-items: center;
    }

    .form {
        display: flex;
        flex-direction: column;
    }
    .form > * {
        margin-bottom: 20px;
    }

    input {
        padding: 10px;
        border-radius: 4px;
    }
</style>