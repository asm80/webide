<script>
    export let ideSize;
    import Monaco from '$lib/monaco/monaco.svelte';
    import EditorTabs from './editorTabs.svelte';
    import { onDestroy, onMount } from 'svelte';
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
    editorText = tab.data;
}

const closeTab = (event) => {
    let tab = event.detail
    tabsOpened = tabsOpened.filter(t => t.fn != tab.fn); 
    console.log("Close tab", tab, tabsOpened)
    tabsOpened = tabsOpened; //do reactivity things
}

const saveFile = async (event) => {
    let data = event.detail

    console.log("Saved file", data, activeTab)
    await fs.writeFile(activeTab.fn.replace("/My Project/",""), data)
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

//file contents is taken from the selected tab
//and displayed in the editor
//when changed, the file contents are updated

$: console.log("IDE SIZE", ideSize)
//$: setEditorText(tabsOpened)
$: changedTab(tabsOpened)

</script>

<EditorTabs tabsOpened={tabsOpened} on:selectTab={selectTab} on:closeTab={closeTab}/>
<Monaco {ideSize} {editorText} on:saveFile={saveFile} on:fileEdited={fileEdited} />