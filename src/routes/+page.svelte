<script>

	let tabsOpened = [
        {fn: "index.html", data: "<h1>Hello World</h1>", dirty:true},
        {fn: "index.js", data: "console.log('Hello World')", active:true},
        {fn: "index.css", dangling: true, data: "h1 {color: red}"}
    ]

	const openFile = (e) => {
		console.log("Open file", e.detail)
		let item = e.detail.item
		tabsOpened = tabsOpened.map(t => {t.active = false; return t})
		tabsOpened.push({fn: item.text, data: "console.log('Hello World') //"+e.detail.path, active:true})
		tabsOpened = tabsOpened
	}

	let ideSize="small"

	import { SignIn, SignOut } from "@auth/sveltekit/components"
	import { page } from "$app/stores"

	import Editor from '$lib/editor/editor.svelte';

	import Nav from '$lib/nav.svelte';
	import SBTree from '$lib/sbtree/sbtree.svelte';
	import Footer from '$lib/footer.svelte';

	import { treeData } from '../test-tree';

	import { onMount } from 'svelte';

	onMount(() => {
		console.log("Mounted")
		const container = document.getElementById("fileTabs");
		// where "container" is the id of the container
  		container.addEventListener("wheel", function (e) {
    		if (e.deltaY > 0) {
      			container.scrollLeft += 100;
      			e.preventDefault();
			// prevenDefault() will help avoid worrisome 
			// inclusion of vertical scroll 
    		}
    		else {
      			container.scrollLeft -= 100;
      			e.preventDefault();
    		}
  		});
// That will work perfectly
	})


</script>

<style>
	.scrollbar::-webkit-scrollbar {
  width: 13px;
}
.scrollbar::-webkit-scrollbar-thumb {
  background: #444;
  border-radius:0;
}

.tabs::-webkit-scrollbar {
  height: 4px;
}
.tabs::-webkit-scrollbar-thumb {
  background: #444;
  border-radius:0;
}



</style>

<div class="{ideSize}">
<Nav />

<div class="columns is-fullheight">
	<div class="column is-2 is-sidebar-menu scrollbar">
		<aside class="amenu">
			<SBTree data={treeData} on:openFile={openFile}/>
		</aside>
	</div>
	<div class="column is-8 ais-fullheight is-main-content p-0">
		<Editor {ideSize} {tabsOpened}/>
	</div>
	<div class="column is-1 ">

{#if $page.data.session}
	{#if $page.data.session.user?.image}
	  <img
		src={$page.data.session.user.image}
		class="avatar"
		alt="User Avatar"
	  />
	{/if}
	{JSON.stringify($page.data.session)}
	<span class="signedInText">
	  <small>Signed in as</small><br />
	  <strong>{$page.data.session.user?.name ?? "User"}</strong>
	</span>
	<SignOut>
	  <div slot="submitButton" class="buttonPrimary">Sign out</div>
	</SignOut>
  {:else}
	<span class="notSignedInText">You are not signed in</span>
	<SignIn>
	  <div slot="submitButton" class="buttonPrimary">Sign in</div>
	</SignIn>
  {/if}

		<select class="select" bind:value={ideSize}>
			<option>small</option>
			<option>medium</option>
			<option>big</option>
		</select>


	</div>

</div>
<Footer />
</div>