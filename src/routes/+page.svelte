<script>

	export let data;

	let tabsOpened = [
        {fn: "index.html", data: "<h1>Hello World</h1>", dirty:true},
        {fn: "index.js", data: "console.log('Hello World')", active:true},
        {fn: "index.css", dangling: true, data: "h1 {color: red}"}
    ]

	console.log(data.fs)
	//data.fs.writeFile("project.toml", "test=0")
	//data.lsconn.setItem("test","testic")

	//find max order number, or 0 if no order given
	const findMaxOrder = () => {
		let max = 0
		for (let t of tabsOpened) {
			if (t.order > max) {
				max = t.order
			}
		}
		return max
	}

	const recountOrder = () => {
		let maxOrder = findMaxOrder()
		//from left to right, skip tabs with order given
		//assign maxOrder+1 to the rest, raise maxOrder
		for (let t of tabsOpened) {
			if (typeof t.order == "undefined") {
				maxOrder++
				t.order = maxOrder
			}
		}
		//all tabs has its own order
		//todo: normalize?

		tabsOpened = tabsOpened
	}

	//todo: distinct click and dblclick

	const deactivateAllTabs = () => {
		tabsOpened = tabsOpened.map(t => {t.active = false; return t})
	}

	const openFile = async (e) => {
		console.log("Open file", e.detail)
		let item = e.detail.item
		let force = e.detail.force
		let path = e.detail.path
		tabsOpened = tabsOpened.map(t => {t.active = false; return t})

		let newData = "";
		try {
			newData = await data.fs.readFile(item.text.replace("/My Project/",""))
		} catch (e) {
			;
		}
		//console.log("newData", newData)

		let newOrder = findMaxOrder() + 1

		//if there is a tab with this file (by path), just active it!
		let found = tabsOpened.filter(t => t.path == path)
		if (found.length > 0) {
			console.log("Found Just Switch Tabs", found)
			deactivateAllTabs()
			found[0].active = true
			found[0].justOpened = true
			tabsOpened = tabsOpened
			return
		}


		//if there is a dangling tab and not forced, replace it, else push new tab
		if (tabsOpened.filter(t => t.dangling).length > 0 && !force) {
			deactivateAllTabs()
			tabsOpened = tabsOpened.map(t => {
				if (t.dangling) {
					t.fn = item.text
					t.data = newData
					t.active = true
					t.justOpened = true;
					t.path = path
					
				}
				return t
			})
		} else 
		{
			deactivateAllTabs()
			tabsOpened.push({
				fn: item.text, 
				data: newData, 
				active:true, 
				justOpened:true, 
				path: path,
				order: newOrder,
				dangling: true
			})
		}
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
		//console.log("Mounted")
		recountOrder()
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

	const buttonTest = async () => {
		console.log("Button test")
		console.log($page.data.session)
		let sess = $page.data.session
		let user = sess.user
		const res = await fetch(`/api/${user.userName}/MyProject/file/1/hejhola/vola.asm80`);
		const item = await res.text();
		console.log(item)
	}

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
		<Editor {ideSize} {tabsOpened} fs={data.fs}/>
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
	
	<span class="signedInText">
	  <small>Signed in as</small><br />
	  <strong>{$page.data.session.user?.userName ?? "User"}</strong>
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

		<button class="button" on:click={buttonTest}>AnyButton</button>
	</div>

</div>
<Footer />
</div>