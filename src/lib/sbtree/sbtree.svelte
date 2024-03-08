<script>

    import { slide } from "svelte/transition";
    export let data;
    export let level=0;
    export let path="/"

    import ContextMenu from "./contextMenu.svelte";

    let showMenu = false;

    let options = {
        expandIcon: 'fa fa-angle-down fa-fw',
        collapseIcon: 'fa fa-angle-right fa-fw',
        expandClass: 'show',
        indent: 1.25,
        parentsMarginLeft: '.55rem',
    }

    let posx, posy
    const showContextMenu = (e) => {
        if (showMenu) {
            showMenu = false
            return
        }
        posx = e.clientX
        posy = e.clientY
                
        console.log("Context menu level", level)
        showMenu = true
    }

    const onPageClick = (e) => {
        showMenu = false
    }

    const updown = (item) => {
        console.log(item)
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


    <div class="{level==0?"sb-tree-wrapper":""}">


{#each data as item, index}
    <div class="item {item.nodes?"folder":"file"} {level==0?"sb-tree-level0":""}" role="button" tabindex="0" 
        on:click={updown(item)} 
        on:keydown={updown(item)}
        on:contextmenu|preventDefault={showContextMenu}

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
            <svelte:self data={item.nodes} level={level+1} path={path+item.text+"/"}/>
        </div>
    {/if}
{/each}

    </div>

    {#if level==0}
        <ContextMenu {showMenu} {posx} {posy} />
    {/if}
            <svelte:window on:click={onPageClick} />
    