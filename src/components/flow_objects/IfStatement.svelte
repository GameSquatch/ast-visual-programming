<script>
    export let test;
    export let consequent;
    export let alternate;
</script>

<div>
    If ({ test.type }) then { consequent.type } {#if alternate !== null}<span>else { alternate.type }</span>{/if}
</div>