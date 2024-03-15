<script>

    import { createEventDispatcher } from "svelte";
    import SBLeaf from "./sbleaf.svelte";
    import { slide } from "svelte/transition";
    export let data;
    export let level=0;
    export let path="/"

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

    let posx, posy


    const showContextMenu = (msg) => {
        console.log("SCM", msg.detail)
        if (showMenu) {
            showMenu = false
            setTimeout(() => {
                posx = msg.detail.posx
                posy = msg.detail.posy
                showMenu = true
            }, 100)
            return
        }
        posx = msg.detail.posx
        posy = msg.detail.posy
                
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
        let posx = e.clientX
        let posy = e.clientY
        //console.log("ctxm, not dispatch, do it instead", level, );
        showContextMenu({detail: {level, posx, posy, item, path}}) //faked message
        //dispatch("ctxm", {level, posx, posy});
    }

    const updown = (item) => {
        //console.log(item)
        item.expanded = !item.expanded
        //item=item
        data=data
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
            <i class="fa-solid fa-file-circle-plus" title="New File"></i>&nbsp;
            <i class="fa-solid fa-folder-plus"  title="New Folder"></i>&nbsp;
            <i class="fa-solid fa-minimize" title="Collapse all"></i>
        </div>
        {/if}
                <!--<i class={item.icon}></i>&nbsp;-->

    </div>
    {#if item.nodes && item.expanded}
        <div style="margin-left:{options.parentsMarginLeft}; border-left:1px dotted #444; padding-left:{options.parentsMarginLeft}" transition:slide>
            <SBLeaf data={item.nodes} level={level+1} path={path+item.text+"/"} on:ctxm={showContextMenu} on:openFile={openFile}/>
        </div>
    {/if}
{/each}

    </div>

    {#if level==0}
        <ContextMenu {showMenu} {posx} {posy} />
    {/if}
            <svelte:window on:click={onPageClick} />
    