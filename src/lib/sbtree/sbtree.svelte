<script>

    import { createEventDispatcher } from "svelte";
    import { pushState, goto } from "$app/navigation"
    import SBLeaf from "./sbleaf.svelte";
    import { slide } from "svelte/transition";
    export let data;
    export let level=0;
    export let path="/"
    export let cursor="";

    import { setExpanded } from "../shared/buildTree.js"

    import ContextMenu from "./contextMenu.svelte";

    import Dropzone from "svelte-file-dropzone";

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

        // clicked on tree item. Let try if appLayout is present. If so, then dispatch appLayout event
        if (item.appLayout) {
            dispatch("appLayout", {layout: item.appLayout})
            return
        }

        if (item.href) {
            //pushState(item.href);
            //history.pushState({}, "", item.href)
            goto(item.href)
            return
        }

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
    const downloadZip = (e) => {
        dispatch("ctxAction", {action:"download", path: "/", itemType:"folder"})
    }

    //universal event raiser
    const raiseEvent = (e) => {
        console.log("Raise event", e.type, e.detail)
        dispatch(e.type, e.detail)
    }

    const ctxAction = (e) => {
        //console.log("Ctx action", e.detail)
        dispatch("ctxAction", e.detail)
    }

    const handleFilesSelect = (e) => {
        let files = {
            accepted: [],
            rejected: []
        };
        const { acceptedFiles, fileRejections } = e.detail;
        files.accepted = [...files.accepted, ...acceptedFiles];
        files.rejected = [...files.rejected, ...fileRejections];
        //console.log("Files", files.accepted)
        if (files.accepted.length>0) {
            dispatch("ctxAction", {action:"upload", path: "/", itemType:"folder", files: files.accepted})
        }
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
    .hovermenu a {
        color:#fff
    }
    .hovermenu a:hover {
        background-color: #333;
        color: gold;
    }


</style>


    <div class="sb-tree-wrapper">


{#each data as item, index}
    <div class="item mb-0 {item.nodes?"folder":"file"} {level==0?"sb-tree-level0":""}" role="button" tabindex="0" 
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
            <a class="p-0 m-0" style="width:1rem" title="New File" on:click|preventDefault|stopPropagation={newFile} href="/"><i class="fa-solid fa-file-circle-plus"></i></a>
            <a class="p-0 m-0" style="width:1rem" title="New Folder" on:click|preventDefault|stopPropagation={newFolder} href="/"><i class="fa-solid fa-folder-plus"></i></a>
            <a class="p-0 m-0" style="width:1rem" title="Download as ZIP" href="/" on:click|preventDefault|stopPropagation={downloadZip}><i class="fa-solid fa-download"></i></a>
        </div>
        {/if}
        {#if item.dropzone}
            <Dropzone on:drop={handleFilesSelect} undisableDefaultStyles containerStyles="background:#333;color:#fff" />
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
                on:openFile={raiseEvent}
                on:move={raiseEvent}
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
    