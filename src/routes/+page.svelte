<script>

	export let data;
	import {buildTree} from '$lib/shared/buildTree.js'
	import { localfs } from '$lib/shared/stores/localfs.js'
	import { dialogs } from "svelte-dialogs";

	import { treeData as defaultTreeData } from '../test-tree';
	import {fixForSave, extractDir, extractFilename, replaceFilename, replaceExtension} from "$util/files.js"
	let treeData = defaultTreeData

	let ideSize="small"

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

	//let tabsOpened = [{fn:"test.asm", data:"ld a, 0", active:true, justOpened:true, path:"test.asm", order:1}, {fn:"test2.asm", data:"ld a, 0", active:false, justOpened:false, path:"test2.asm", order:2}]	

	let tabsOpened = []

	import CompilerWorker from '../workers/compiler.js?worker'
//	import {compile} from '$util/compiler.js'
	let compilerWorker

	let cursor=""; //path of edited file

	//lazy rebuild
	let lastFilenum = -1

	const rebuildTree = async(forced=false) => {
		let res = await data.fs.readdir("")
		console.log("RES", res)
		if (res.length == lastFilenum && !forced) return
		console.log("Rebuild tree")
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
		deactivateAllTabs()

		let newData = "";
		try {
			console.log("Reading file", item, fixForSave(item.path))
			newData = await data.fs.readFile(fixForSave(item.path))
		} catch (e) {
			;
		}
		//console.log("newData", newData)
		console.log("before", tabsOpened)

		let newOrder = findMaxOrder() + 1

		//if there is a tab with this file (by path), just active it!
		let found = tabsOpened.filter(t => t.path == path)
		if (found.length > 0) {
			console.log("Found Just Switch Tabs", found)
			deactivateAllTabs()
			found[0].active = true
			found[0].justOpened = true
			tabsOpened = tabsOpened
			cursor = found[0].path
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
					cursor = path
					
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
			cursor = path
		}
		tabsOpened = tabsOpened
	}

	const workerMessageProcessing = async (msg) => {
		console.log("Worker message", msg)
		if (msg.msg == "compiled") {
			let error = msg.error
			if (error) {
				dialogs.alert(`Compilation error:<br>${error.msg}<br>Line Number: ${error.s.numline}<br>Line: <i>${error.s.line}</i>`)
				//console.error("Compilation error", error)
				return
			}
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
	}


	onMount(async () => {
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

		//worker
		//compilerWorker = new CompilerWorker()
		const CompilerWorker = (await import('../workers/compiler.js?worker')).default;
		compilerWorker = new CompilerWorker()
		compilerWorker.onmessage = (e) => {
			workerMessageProcessing(e.data)
		}

// That will work perfectly
	})

	const buttonTest = async () => {
		console.log("Button test")
		/*
		console.log($page.data.session)
		let sess = $page.data.session
		let user = sess.user
		const res = await fetch(`/api/${user.userName}/MyProject/file/1/hejhola/vola.asm80`);
		const item = await res.text();
		console.log(item)
		*/

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
		compilerWorker.postMessage( {msg:"compile",file:fixForSave(activeTab.path), fs:get(localfs)})
	}

	const closeTab = (event) => {
		let tab = event.detail
		tabsOpened = tabsOpened.filter(t => t.path != tab.path); 
		console.log("Close tab", tab, tabsOpened)
		recountOrders(tabsOpened)
		//activate tab with highest order
		let max = findMaxOrder()
		let newActive = tabsOpened.filter(t => t.order == max)[0]
		if (newActive) {
			newActive.active = true
			//editorText = tab.data;
		}
		tabsOpened = tabsOpened; //do reactivity things
	}

	const selectTab = (event) => {
		console.log("Select Tab Top Level", event.detail)
		cursor = event.detail.path
	}

	const ctxAction = async (event) => {
		let {action, path, itemType} = event.detail
		let dir;
		let name;
		switch (action) {
			case "deleteitem":
				
				let result = await dialogs.confirm("Are you sure you want to delete '"+fixForSave(path)+"'?", "Delete file")
				if (!result) return
				console.log("Delete item", path, result)
				if (itemType == "file") {
					await data.fs.unlink(fixForSave(path))
				} else {
					let filelist = await data.fs.readdir(fixForSave(path))
					console.log("To Delete", filelist)
					for (let fn of filelist) {
						await data.fs.unlink(fixForSave(path+"/"+fn))
					}
					
				}
				//remove path from tabs, if there is
				tabsOpened = tabsOpened.filter(t => t.path != path)
				rebuildTree()
				break;
			case "additem":
				dir = path;
				if (itemType == "file") {
					dir = extractDir(path)
				}
				name = await dialogs.prompt("File name", {title:"Create file in "+(dir), submitButtonText:"Create", resetButton:false})
				if (!name) return
				console.log("Add item", name)
				await data.fs.writeFile(fixForSave(dir+"/"+name), "")
				rebuildTree()
				break;
			case "addfolder":
				dir = path;
				if (itemType == "file") {
					dir = extractDir(path)
				}
				name = await dialogs.prompt("File name", {title:"Create folder in "+(dir), submitButtonText:"Create", resetButton:false})
				if (!name) return
				await data.fs.writeFile(fixForSave(dir+"/"+name+"/..empty"), "")
				rebuildTree()
				break;
			case "rename":

				name = await dialogs.prompt("New name", {title:"Rename "+extractFilename(path), submitButtonText:"Rename", resetButton:false})
				if (!name) return
				let newPath = replaceFilename(path, name)
				console.log("rename item", path, newPath)
				await data.fs.rename(fixForSave(path), fixForSave(newPath))
				rebuildTree(true)
				break;
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
		<button class="button" on:click={buttonTest}>AnyButton</button>
		<br>
		<button class="button" on:click={doCompile}>Compile</button>
	</div>

</div>
<Footer />
</div>