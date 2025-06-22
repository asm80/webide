<script>

	export let data;
	import {buildTree} from '$lib/shared/buildTree.js'
	import { localfs } from '$lib/shared/stores/localfs.js'
	import { Alert, Prompt } from "$lib/dialogs";

	import { treeData as defaultTreeData } from '../test-tree';
	import {fixForSave, extractDir, extractFilename, replaceFilename, replaceExtension} from "$util/files.js"


	import { SignIn, SignOut } from "@auth/sveltekit/components"
	import { page } from "$app/stores"

	import Editor from '$lib/editor/editor.svelte';

	import Nav from '$lib/nav.svelte';
	import SBTree from '$lib/sbtree/sbtree.svelte';
	import Footer from '$lib/footer.svelte';

	import ProjectSelector from '$lib/projectSelector/projectSelector.svelte';
	import SwitchLayout from '../lib/switchLayout.svelte';

	import { onMount } from 'svelte';
	import {recountOrders} from "$util/tabs.js"

	import { get } from 'svelte/store';

	import * as TOML from '@ltd/j-toml';

	import ui from "$lib/ui/ui.js"

	import compilerWorker from "$util/workerPromise.js"

	import { projectStore } from "$lib/shared/stores/project.js"

	let treeData = defaultTreeData

	let ideSize="small"
	let tabsOpened = []

	let appLayout = "main"; //main, projectSelector, ...

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
/*
	let project = {
		name:"My Project",
		ide: {
			size:"medium"
		}
	}
*/
	//find _project.toml and parse it
	//if not found, create it

	let project = get(projectStore)

	const projectInit = async () => {
		try {
			let projectToml = TOML.parse(await data.fs.readFile("_project.toml"))
			console.log("Project toml", projectToml)
			//delete project.needInit
			project=projectToml
			projectStore.set(projectToml)
			ideSize = project.ide.size?project.ide.size:"small"
		} catch (e) {
			//console.log("Project toml not found, creating", TOML.stringify(project, {newline: "\n"}))
			//await data.fs.writeFile("_project.toml", TOML.stringify(get(projectStore), {newline: "\n"}))
			//not needed now.
			console.log("EEE",e)
			delete project.needInit; //mke init project permanent
		}	
	}

	
	projectInit()

	const saveProjectTOML = async (project) => {
		console.log("Save project toml", project)
		if (project.needInit) return; //it overwrites the project.toml when store init, so there is a needInit flag.
		console.log("Save project toml", project)
		let toml = TOML.stringify(project, {newline: "\n"})
		await data.fs.writeFile("_project.toml", toml)
		// is _project.toml in opened tabs?
		let found = tabsOpened.filter(t => t.path == `/${project.name}/_project.toml`)
		console.log("Found", toml, found, tabsOpened)
		if (found.length > 0) {
			found[0].data = toml
			found[0].justOpened = true
			tabsOpened = tabsOpened
		}
	}

	$: saveProjectTOML(project)
	$: project.ide.size = ideSize

	localfs.subscribe(rebuildTree)
	
	// TODO: There should be a mechanism to prevent multiple rebuilds
	// of the tree. It is not a problem now, but it will be
	// DONE: resolved by adding (key) parameter for tree leaves #each

	// TODO: There should be a mechanism to subscribe changes of individual files, i.e. "file is opened in a tab"
	// it should watch file and update the tab if the file is changed
	// something like: fileChangeSub(file, callback) and fileChangeUnsub(file)
	// needed behavior: when file is opened and something changes in the file system, the tab should be updated
	// DONE: sync mechanism is implemented by justOpened flag.

	// TODO: distinct between click and doubleclick on the tree leaf
	// DONE: implemented by timeout function in ui.openFile


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
		//ui.buttonTest(tabsOpened)
		tabsOpened.filter(t => t.active)[0].data += "Button test"
		tabsOpened.filter(t => t.active)[0].justOpened = true;
		tabsOpened = tabsOpened
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
				Alert("Compilation successful")
			}
		} catch (e) {
			Alert(`Compilation error:<br>${e.msg}<br>Line Number: ${e.s.numline}<br>Line: <i>${e.s.line}</i>`)
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
		console.log("Open file", res)
		tabsOpened = res.tabsOpened
		cursor = res.cursor
	}

	const setAppLayout = (event) => {
		console.log(event)
		if (event.target) {
			appLayout = event.target.dataset.layout
		} else {
			appLayout = event.detail.layout
		}
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
	{#if appLayout == "main"}
	
	<div class="column is-2 is-sidebar-menu scrollbar">
		<aside class="amenu">
			<SBTree data={treeData} cursor={cursor} project={project} on:openFile={openFile} on:ctxAction={ctxAction} on:appLayout={setAppLayout}/>
		</aside>
	</div>
	<div class="column is-8 ais-fullheight is-main-content p-0">
		<Editor {ideSize} {tabsOpened} on:closeTab={closeTab} on:selectTab={selectTab} fs={data.fs}/>
	</div>

	{/if}


	{#if appLayout == "projectSelector"}
	<div class="column is-10 is-main-content">
		<h1 class="title">Project selector</h1>
		<ProjectSelector session={$page.data.session?.user}/>
		<SwitchLayout on:setAppLayout={setAppLayout} />
	</div>
	{/if}

	{#if appLayout == "online"}
	<div class="column is-10 is-main-content">
		<h1 class="title">Online projects</h1>
		<p>Project selector is not implemented yet</p>
		<SwitchLayout on:setAppLayout={setAppLayout} />
	</div>
	{/if}

	{#if appLayout == "terminal"}
	<div class="column is-10 is-main-content">
		<h1 class="title">Serial terminal</h1>
		<p>Project selector is not implemented yet</p>
		<SwitchLayout on:setAppLayout={setAppLayout} />
	</div>
	{/if}

	{#if appLayout == "emulatorSelector"}
	<div class="column is-10 is-main-content">
		<h1 class="title">Emulators</h1>
		<p>Project selector is not implemented yet</p>
		<SwitchLayout on:setAppLayout={setAppLayout} />
	</div>
	{/if}


	{#if appLayout == "settings"}
	<div class="column is-10 is-main-content">
		<h1 class="title">IDE settings</h1>
		<p>Project selector is not implemented yet</p>
		<SwitchLayout on:setAppLayout={setAppLayout} />
	</div>
	{/if}


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