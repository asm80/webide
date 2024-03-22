<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = new createEventDispatcher ();
    const setAppLayout = (e) => {
        dispatch("setAppLayout", {layout:e.target.dataset.layout});
    }
    export let newLayout = "editor";
    export let title = "Back to editor"
</script>
<div class="py-5 my-5">
<a class="button" on:click={setAppLayout} href="/{newLayout}">{title}</a>
</div>