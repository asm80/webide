<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = new createEventDispatcher ();
    const setAppLayout = (e) => {
        dispatch("setAppLayout", {layout:e.target.dataset.layout});
    }
    export let newLayout = "main";
    export let title = "Back to main"
</script>
<div class="py-5 my-5">
<button class="button" on:click={setAppLayout} data-layout="{newLayout}">{title}</button>
</div>