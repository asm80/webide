<script>

    import { createEventDispatcher } from "svelte";
    import SBLeaf from "./sbleaf.svelte";
    import { slide } from "svelte/transition";
    export let data;
    export let level=0;
    export let path="/"
    export let cursor="";

    import { setExpanded } from "../shared/buildTree.js"

    import ContextMenu from "./contextMenu.svelte";

    let showMenu = false;
    const dispatch = createEventDispatcher();


    let options = {
        expandIcon: 'fa fa-angle-down fa-fw',
        collapseIcon: 'fa fa-angle-right fa-fw',
        expandClass: 'show',
        indent: 1.25,
        parentsMarginLeft: '.55rem',
    }

    let posx, posy, ctxPath, itemType


    const showContextMenu = (msg) => {
        console.log("SCM", msg.detail)
        if (showMenu) {
            showMenu = false
            setTimeout(() => {
                posx = msg.detail.posx
                posy = msg.detail.posy
                ctxPath = msg.detail.path
                itemType = msg.detail.item.nodes?"folder":"file"
                showMenu = true
            }, 100)
            return
        }
        posx = msg.detail.posx
        posy = msg.detail.posy
        ctxPath = msg.detail.path
        itemType = msg.detail.item.nodes?"folder":"file"
                
        //console.log("Context menu level", level)
        showMenu = true
        posx = posx
    }



    const onPageClick = (e) => {
        showMenu = false
    }

    const openFile = (e) => {
        //console.log("Open file", e.detail)
        //raise open file
        dispatch("openFile", e.detail);
    }

    //const dispatch = createEventDispatcher();

    const ctxm = (e,item, path) => {
        if (item.disableCtx) return
        let posx = e.clientX
        let posy = e.clientY
        //console.log("ctxm, not dispatch, do it instead", level, );
        showContextMenu({detail: {level, posx, posy, item, path}}) //faked message
        //dispatch("ctxm", {level, posx, posy});
    }

    const updown = (item, force=false) => {
        //console.log(item)
        item.expanded = !item.expanded
        setExpanded(path+item.text+"/", item.expanded)
        //item=item
        data=data
    }

    const newFile = (e) => {
        dispatch("ctxAction", {action:"additem", path: "/", itemType:"folder"})
    }
    const newFolder = (e) => {
        dispatch("ctxAction", {action:"addfolder", path: "/", itemType:"folder"})
    }

    const ctxAction = (e) => {
        //console.log("Ctx action", e.detail)
        dispatch("ctxAction", e.detail)
    }
</script>

<style>
    .sb-tree-wrapper {
    }
    .sb-tree-wrapper div {
        /*padding: 5px;*/
    }
    .sb-tree-wrapper div.item:hover {
        background-color: #333;
    }
    .sb-tree-wrapper div.item {
        cursor: pointer;
       /*margin-right: 5px;*/
    }
    .sb-tree-level0 {
        /*font-weight: bold;*/
        text-transform: uppercase;
        /*background-color: #444;*/
    }
    .sb-tree-wrapper .hovermenu {
        visibility: hidden;
    }
    .sb-tree-wrapper:hover .hovermenu {
        visibility: visible;
    }
</style>


    <div class="sb-tree-wrapper">


{#each data as item, index}
    <div class="item {item.nodes?"folder":"file"} {level==0?"sb-tree-level0":""}" role="button" tabindex="0" 
        on:click={updown(item)} 
        on:dblclick={updown(item, true)}
        on:keydown={updown(item)}
        on:contextmenu|preventDefault={(e)=>ctxm(e,item, path+item.text)}
        on:ctxm={showContextMenu}

        title="{item.title?item.title:(path+item.text)}"
        >
        {#if item.nodes}
            <i class={item.expanded?options.expandIcon:options.collapseIcon}></i>
        {/if}
        {item.text}
        {#if item.hoverMenu}
        <div class="is-pulled-right has-text-right hovermenu">
            <i class="fa-solid fa-file-circle-plus" title="New File" on:click|preventDefault|stopPropagation={newFile}></i>&nbsp;
            <i class="fa-solid fa-folder-plus"  title="New Folder"  on:click|preventDefault|stopPropagation={newFolder}></i>&nbsp;
            <i class="fa-solid fa-minimize" title="Collapse all"></i>
        </div>
        {/if}
                <!--<i class={item.icon}></i>&nbsp;-->

    </div>
    {#if item.nodes && item.expanded}
        <div style="margin-left:{options.parentsMarginLeft}; border-left:1px dotted #444; padding-left:{options.parentsMarginLeft}" transition:slide>
            <SBLeaf 
                data={item.nodes} 
                level={level+1} 
                path={path+item.text+"/"} 
                cursor={cursor}
                on:ctxm={showContextMenu} 
                on:openFile={openFile}
            />
        </div>
    {/if}
{/each}

    </div>

    {#if level==0}
        <ContextMenu {showMenu} {posx} {posy} {ctxPath} {itemType}
        on:ctxAction={ctxAction} />
    {/if}
            <svelte:window on:click={onPageClick} />
    