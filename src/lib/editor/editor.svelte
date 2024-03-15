<script>
    export let ideSize;
    import Monaco from '$lib/monaco/monaco.svelte';
    import EditorTabs from './editorTabs.svelte';
    import { onDestroy, onMount } from 'svelte';
    let editorText = "Dummy"
    export let tabsOpened;



    let activeTab

    const setEditorText = () => {
        activeTab = tabsOpened.filter(t => t.active)[0]
        editorText = activeTab.data; 
    }

    onMount(() => {
        setEditorText()
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
$: setEditorText(tabsOpened)

</script>

<EditorTabs tabsOpened={tabsOpened} on:selectTab={selectTab} on:closeTab={closeTab}/>
<Monaco {ideSize} editorText={editorText} on:saveFile={saveFile} on:fileEdited={fileEdited} />