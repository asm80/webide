<script>
    export let session;

    import { SignIn, SignOut } from "@auth/sveltekit/components"

</script>

<div>

    {#if typeof session=="undefined"}
        <h2>You have to log in / register to maintain more projects</h2>
        <SignIn>
            <div slot="submitButton" class="buttonPrimary">Sign in</div>
        </SignIn>
    {:else}
        <h2>Here are your projects</h2>
    {/if}

{JSON.stringify(session)}

</div>