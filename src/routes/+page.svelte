<script>

	export let data;
	import {buildTree} from '$lib/shared/buildTree.js'
	import { localfs } from '$lib/shared/stores/localfs.js'
	import { dialogs } from "svelte-dialogs";

	import { treeData as defaultTreeData } from '../test-tree';
	import {fixForSave, extractDir, extractFilename, replaceFilename, replaceExtension} from "$util/files.js"


	import { SignIn, SignOut } from "@auth/sveltekit/components"
	import { page } from "$app/stores"

	import Editor from '$lib/editor/editor.svelte';

	import Nav from '$lib/nav.svelte';
	import SBTree from '$lib/sbtree/sbtree.svelte';
	import Footer from '$lib/footer.svelte';

	import { onMount } from 'svelte';
	import {recountOrders} from "$util/tabs.js"

	import { get } from 'svelte/store';

	import * as TOML from '@ltd/j-toml';

	import ui from "$lib/ui/ui.js"

	import compilerWorker from "$util/workerPromise.js"

	let treeData = defaultTreeData

	let ideSize="small"
	let tabsOpened = []

	let cursor=""; //path of edited file

	//lazy rebuild
	let lastFilenum = -1

	const rebuildTree = async(forced=false) => {
		let res = await data.fs.readdir("")
//		console.log("RES", res)
		if (res.length == lastFilenum && !forced) return
//		console.log("Rebuild tree")
		lastFilenum = res.length
		treeData = await buildTree(res, data.fs, project)
	}
	rebuildTree()

	let project = {
		name:"My Project",
		ide: {
			size:"medium"
		}
	}

	//find _project.toml and parse it
	//if not found, create it

	const projectInit = async () => {
		try {
			let projectToml = TOML.parse(await data.fs.readFile("_project.toml"))
		//console.log("Project toml", projectToml)
			project = projectToml
			ideSize = project.ide.size?project.ide.size:"small"
		} catch (e) {
			//console.log("Project toml not found, creating", TOML.stringify(project, {newline: "\n"}))
			await data.fs.writeFile("_project.toml", TOML.stringify(project, {newline: "\n"}))
		}	
	}

	
	projectInit()

	localfs.subscribe(rebuildTree)
	
	// TODO: There should be a mechanism to prevent multiple rebuilds
	// of the tree. It is not a problem now, but it will be

	// TODO: There should be a mechanism to subscribe changes of individual files, i.e. "file is opened in a tab"
	// it should watch file and update the tab if the file is changed
	// something like: fileChangeSub(file, callback) and fileChangeUnsub(file)


	onMount(async () => {
		//console.log("Mounted")
		recountOrders(tabsOpened)
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

		compilerWorker.workerInit('../workers/compiler.js?worker');

	})


	const ibuttonTest = async () => {
		console.log("Button test")
		ui.buttonTest(tabsOpened)
		return


		let fs = get(localfs)
		compilerWorker.postMessage( {msg:"compile",file:"test.a80", fs:fs})
		console.log("Posted")
		//let asm = await compile("test.a80", fs)
		//console.log(s)
	}

	const doCompile = async () => {
		let activeTab = tabsOpened.filter(t => t.active)[0]
		if (!activeTab) return
		console.log("DOCO",activeTab.path)
		try {
			let msg = await compilerWorker.postMessage( {msg:"compile",file:fixForSave(activeTab.path), fs:get(localfs)})
			if (msg.msg == "compiled") {
				let file = msg.file
				let hex = msg.data.hex
				let lst = msg.data.lst
				let path = extractDir(file)
				let fn = extractFilename(file)
				let dstPath = path
				console.log("Compiled", path,fn)
				if (path.includes("src")) {
					dstPath = path.replace("src", "hex/")
					//console.log("DST", dstPath)
					await data.fs.writeFile(dstPath+replaceExtension(fn,"hex"), hex)
					dstPath = path.replace("src", "lst/")
					await data.fs.writeFile(dstPath+replaceExtension(fn,"lst"), lst)
				} else {
					await data.fs.writeFile(path+replaceExtension(fn,"hex"), hex)
					await data.fs.writeFile(path+replaceExtension(fn,"lst"), lst)
				}
				dialogs.alert("Compilation successful")
			}
		} catch (e) {
			dialogs.alert(`Compilation error:<br>${e.msg}<br>Line Number: ${e.s.numline}<br>Line: <i>${e.s.line}</i>`)
			//console.error("Compilation error", error)
			return
		}
	}

	// proxy functions for event handling. It passes essential data to UI module

	const closeTab = (event) => {
		tabsOpened=ui.closeTab(event,tabsOpened)
	}

	const selectTab = (event) => {
		cursor = event.detail.path
	}

	const ctxAction = (event) => {
		ui.ctxAction(event, tabsOpened, data, rebuildTree)
	}

	const openFile = async (e) => {
		let res = await ui.openFile(e, tabsOpened, cursor, data)
		tabsOpened = res.tabsOpened
		cursor = res.cursor
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
			<SBTree data={treeData} cursor={cursor} project={project} on:openFile={openFile} on:ctxAction={ctxAction}/>
		</aside>
	</div>
	<div class="column is-8 ais-fullheight is-main-content p-0">
		<Editor {ideSize} {tabsOpened} on:closeTab={closeTab} on:selectTab={selectTab} fs={data.fs}/>
	</div>
	<div class="column is-2 ">

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
		<br>
		<button class="button" on:click={ibuttonTest}>AnyButton</button>
		<br>
		<button class="button" on:click={doCompile}>Compile</button>
	</div>

</div>
<Footer />
</div>