<script>
    export let ideSize;
    import Monaco from '$lib/monaco/monaco.svelte';
    import EditorTabs from './editorTabs.svelte';

    let editorText = "Dummy"

    let tabsOpened = [
        {fn: "index.html", data: "<h1>Hello World</h1>"},
        {fn: "index.js", data: "console.log('Hello World')", active:true},
        {fn: "index.css", data: "h1 {color: red}"}
    ]

    const selectTab = (event) => {
        let tab = event.detail
    for (let t of tabsOpened) {
        t.active = false;
    }
    tab.active = true;
    tabsOpened = tabsOpened;
    console.log("Selected tab", tab)
}

//file contents is taken from the selected tab
//and displayed in the editor
//when changed, the file contents are updated



</script>

<EditorTabs tabsOpened={tabsOpened} on:selectTab={selectTab}/>
<Monaco ideSize={ideSize} editorText={editorText} />