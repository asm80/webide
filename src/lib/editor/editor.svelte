<script>
    export let ideSize;
    import Monaco from '$lib/monaco/monaco.svelte';
    import { dialogs } from "svelte-dialogs";
    import EditorTabs from './editorTabs.svelte';
    import { onDestroy, onMount } from 'svelte';
    import { replaceFilename, fixForSave } from "$util/files.js"
    let editorText = "Dummy"
    export let tabsOpened;

    export let fs;


    let activeTab

    const findMaxOrder = () => {
		let max = 0
		for (let t of tabsOpened) {
			if (t.order > max) {
				max = t.order
			}
		}
		return max
	}

    const findMinOrder = () => {
        let min = 100000
        for (let t of tabsOpened) {
            if (t.order < min) {
                min = t.order
            }
        }
        return min
    }

    const findMinOrderAfter = (limit) => {
        let min = 100000
        for (let t of tabsOpened) {
            if (t.order < min && t.order > limit) {
                min = t.order
            }
        }
        return min
    }

    const orderDownByIf = (limit, by) => {
        for (let t of tabsOpened) {
            if (t.order > limit) {
                t.order -= by
            }
        }
    }

    const recountOrders = () => {
        let target = 1
        let by = findMinOrder() - target
        for (let i=0;i<tabsOpened.length;i++) {
            orderDownByIf(target, by)
            target++
            by = findMinOrderAfter(target-1) - target
        }
        
    }

    const setEditorText = () => {
        activeTab = tabsOpened.filter(t => t.active)[0]
        //if no active tab, select the first one
        if (!activeTab) {
            //select the tab with highest order
            let max = findMaxOrder()
           activeTab = tabsOpened.filter(t => t.order == max)[0]
           activeTab.active = true
        }
        editorText = activeTab.data; 
    }

    const changedTab = (newTabs) => {
        console.log("Changed tab", activeTab)
        //find the "just opened" tab and set it as active
        let justOpened = newTabs.filter(t => t.justOpened)
        if (justOpened.length > 0) {
            activeTab = justOpened[0]
            delete activeTab.justOpened
            setEditorText()
            return
        }
        if (activeTab && !activeTab.active) {
            setEditorText()
            return
        }
        if (activeTab && activeTab.active && activeTab.justOpened) {
            delete activeTab.justOpened
            setEditorText()
        }
    }

    onMount(() => {
        setEditorText()
    })



    const selectTab = (event) => {
        let tab = event.detail
        activeTab = tab
        if (activeTab.active) {
            activeTab.dangling = false
        }
    for (let t of tabsOpened) {
        t.active = false;
    }
    tab.active = true;
    tabsOpened = tabsOpened;
    let maxOrder = findMaxOrder()
    if (activeTab.order<maxOrder) activeTab.order = maxOrder+1
    console.log("Selected tab", tab)
    recountOrders()
    editorText = tab.data;
}

const closeTab = (event) => {
    let tab = event.detail
    tabsOpened = tabsOpened.filter(t => t.fn != tab.fn); 
    console.log("Close tab", tab, tabsOpened)
    recountOrders()
    tabsOpened = tabsOpened; //do reactivity things
}

const saveFile = async (event) => {
    let data = event.detail

    console.log("Saved file", data, activeTab)
    await fs.writeFile(fixForSave(activeTab.path), data)
    activeTab.dirty = false
    tabsOpened = tabsOpened
}
const fileEdited = (event) => {
    let data = event.detail
    activeTab.data = data
    activeTab.dirty = true
    activeTab.dangling = false
    tabsOpened = tabsOpened
}

const saveFileAs = async (event) => {
    let data = event.detail
    let newName = await dialogs.prompt("File name", {title:"Save file as", submitButtonText:"Save", resetButton:false})
    if (!newName) return
    let path = activeTab.path
    let newPath = replaceFilename(path, newName)
    activeTab.fn = newName
    activeTab.path = newPath
    activeTab.dirty = false
    await fs.writeFile(fixForSave(activeTab.path), data)
    tabsOpened = tabsOpened
    //needs redraw file system... should fire some action or something
}

//file contents is taken from the selected tab
//and displayed in the editor
//when changed, the file contents are updated

$: console.log("IDE SIZE", ideSize)
//$: setEditorText(tabsOpened)
$: changedTab(tabsOpened)

</script>

<EditorTabs 
    tabsOpened={tabsOpened} 
    on:selectTab={selectTab} 
    on:closeTab={closeTab}
/>

<Monaco 
    {ideSize} 
    {editorText} 
    on:saveFile={saveFile} 
    on:saveFileAs={saveFileAs}
    on:fileEdited={fileEdited} 
/>