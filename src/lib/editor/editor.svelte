<script>
    export let ideSize;
    import Monaco from '$lib/monaco/monaco.svelte';
    import EditorTabs from './editorTabs.svelte';
    import { onDestroy, onMount } from 'svelte';
    let editorText = "Dummy"

    let tabsOpened = [
        {fn: "index.html", data: "<h1>Hello World</h1>", dirty:true},
        {fn: "index.js", data: "console.log('Hello World')", active:true},
        {fn: "index.css", dangling: true, data: "h1 {color: red}"}
    ]

    let activeTab
    onMount(() => {
        activeTab = tabsOpened.filter(t => t.active)[0]
        editorText = activeTab.data;
    })


    const selectTab = (event) => {
        let tab = event.detail
        activeTab = tab
    for (let t of tabsOpened) {
        t.active = false;
    }
    tab.active = true;
    tabsOpened = tabsOpened;
    console.log("Selected tab", tab)
    editorText = tab.data;
}

const closeTab = (event) => {
    let tab = event.detail
    tabsOpened = tabsOpened.filter(t => t.fn != tab.fn); 
    console.log("Close tab", tab, tabsOpened)
    tabsOpened = tabsOpened; //do reactivity things
}

const saveFile = (event) => {
    let data = event.detail

    console.log("Saved file", data, activeTab)
    activeTab.dirty = false
    tabsOpened = tabsOpened
}
const fileEdited = (event) => {
    let data = event.detail
    activeTab.data = data
    activeTab.dirty = true
    tabsOpened = tabsOpened
}

//file contents is taken from the selected tab
//and displayed in the editor
//when changed, the file contents are updated

$: console.log("IDE SIZE", ideSize)

</script>

<EditorTabs tabsOpened={tabsOpened} on:selectTab={selectTab} on:closeTab={closeTab}/>
<Monaco {ideSize} editorText={editorText} on:saveFile={saveFile} on:fileEdited={fileEdited} />