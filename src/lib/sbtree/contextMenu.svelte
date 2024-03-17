<script>
    import { createEventDispatcher } from "svelte";
    export let showMenu = false;
    export let posx;
    export let posy;
    export let ctxPath;
    export let itemType;
    // pos is cursor position when right click occur
    let pos = { x: 0, y: 0 }
    // menu is dimension (height and width) of context menu
    let menu = { h: 0, y: 0 }
    // browser/window dimension (height and width)
    let browser = { h: 0, y: 0 }
    // showMenu is state of context-menu visibility
    //let showMenu = false;
    // to display some text
    let content;

    const dispatch = createEventDispatcher();


    function getContextMenuDimension(node){
        // This function will get context menu dimension
        // when navigation is shown => showMenu = true
        let height = node.offsetHeight
        let width = node.offsetWidth
        menu = {
            h: height,
            w: width
        }
    }

    let dummyHandler = (e, action) => {
        // This function will handle right click event
        // and display context menu
        //console.log("Menu Action E", e, action, ctxPath)
        dispatch("ctxAction", {action, path: ctxPath, itemType})
    }

    const changeState = (state) => {
        // This function will change state of context menu
        // when right click event occur
        console.log("Change state", state, posx, posy)
        if (state) {
            browser = {
            w: window.innerWidth,
            h: window.innerHeight
        };
        pos = {
            x: 100, //posx,
            y: posy
        };
        // If bottom part of context menu will be displayed
        // after right-click, then change the position of the
        // context menu. This position is controlled by `top` and `left`
        // at inline style. 
        // Instead of context menu is displayed from top left of cursor position
        // when right-click occur, it will be displayed from bottom left.
        console.log("Browser", browser, pos, menu)
        if (browser.h -  pos.y < menu.h)
            pos.y = browser.h - menu.h
        if (browser.w -  pos.x < menu.w)
            pos.x = pos.x - menu.w
        }
    }

    $: changeState(showMenu)

    let menuItems = [
        {
            'name': 'addItem',
            'onClick': (e)=>dummyHandler(e,"additem"),
            'displayText': "Add File",
            'class': 'fa-solid fa-file-circle-plus'
        },
        {
            'name': 'addFolder',
            'onClick': (e)=>dummyHandler(e,"addfolder"),
            'displayText': "Add Folder",
            'class': 'fa-solid fa-folder-plus'
        },
        {
            'name': 'rename',
            'onClick': (e)=>dummyHandler(e,"rename"),
            'displayText': "Rename",
            'class': 'fa-solid fa-shuffle'
        },
        /*
        {
            'name': 'printMenu',
            'onClick': dummyHandler,
            'displayText': "Print",
            'class': 'fa-solid fa-print'
        },
        
        {
            'name': 'settings',
            'onClick': dummyHandler,
            'displayText': "Settings",
            'class': 'fa-solid fa-gear'
        },
        */
        {
            'name': 'trash',
            'onClick': (e)=>dummyHandler(e,"deleteitem"),
            'displayText': "Trash",
            'class': 'fa-solid fa-trash-can'
        },
    ]
</script>

<style>
    .contextmenu {
        font-size: inherit;
        padding:3px;
        background: #444;
    }
    .contextmenu ul li a {
        background-color: #444;
    }
    .contextmenu ul li a:hover {
        background-color: #000;
        color:#fff
    }
</style>

{#if showMenu}
<div use:getContextMenuDimension class="menu contextmenu has-background-dark has-text-light" style="position: absolute; top:{pos.y}px; left:{pos.x}px; border:1px solid white">
        <ul class="menu-list">
            {#each menuItems as item}

                    <li><a on:click={item.onClick}><i class={item.class}></i>&nbsp;{item.displayText}</a></li>
            {/each}
        </ul>
</div>
{/if}