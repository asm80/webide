<script>

    import { createEventDispatcher } from "svelte";
    import { slide } from "svelte/transition";
    import { setExpanded } from "../shared/buildTree.js";
    export let data;
    export let level=0;
    export let path="/"
    export let cursor="";


    let showMenu = false;



    let options = {
        expandIcon: 'fa fa-angle-down fa-fw',
        collapseIcon: 'fa fa-angle-right fa-fw',
        expandClass: 'show',
        indent: 1.25,
        parentsMarginLeft: '.55rem',
    }





    const onPageClick = (e) => {
        showMenu = false
    }

    const dispatch = createEventDispatcher();

    const ctxm = (e, item, path) => {
        let posx = e.clientX
        let posy = e.clientY
        //console.log("ctxm dispatch", level, e, item, path);
        dispatch("ctxm", {level, posx, posy, item, path});
    }

    const raiseCtxm = (e) => {
        //console.log("Raise ctxm", e)
        dispatch("ctxm", e.detail);
    }

    const raiseOpenFile = (e) => {
        //console.log("Raise openFile", e)
        dispatch("openFile", e.detail);
    }

    //universal event raiser
    const raiseEvent = (e) => {
        //console.log("Raise event", e.type, e.detail)
        dispatch(e.type, e.detail)
    }

    const updown = (item, force=false) => {
        //console.log(item)
        if (!item.nodes) {
            //is a file, need to dispatch an event
            dispatch("openFile", {item, path: path+item.text, force})
            return
        }
        item.expanded = !item.expanded

        setExpanded(path+item.text+"/", item.expanded)
        //item=item
        data=data
    }

    let dropZone = null;
    function handleDragStart(e) {
        e.dataTransfer.dropEffect = "move";
        e.dataTransfer
         .setData("text", e.target.getAttribute('data-f'));
    }

    function handleDragEnd(e) {
    }

    function handleDragEnter(e) {

        dropZone = e.target.getAttribute('data-p');
        e.target.style.backgroundColor = '#446';
        //console.log("Entering", dropZone)
    }

    function handleDragLeave(e) {
        e.target.style.backgroundColor = 'rgb(20, 20, 20)';
        if (dropZone == e.target.getAttribute('data-p')) {
            //dropZone = null;  
        }
    }

    function handleDragDrop(e) {
        e.target.style.backgroundColor = 'rgb(20, 20, 20)';
        var element_id = e
            .dataTransfer
            .getData("text");
        //console.log("You droped " + element_id + " into "+dropZone)
        if (!dropZone) {
            return
        }
        //console.log("Dispatched",{from: element_id, to: dropZone})
        dispatch("move", {from: element_id, to: dropZone})
        dropZone=null
        //console.log(status)
    }

</script>
<style>

    .sb-tree-wrapper div.item:hover {
        background-color: #333;
    }
    div.item {
        cursor: pointer;
       /*margin-right: 5px;*/
    }
    div.item.cursor {
        background-color: #444;
    }
    .sb-tree-level0 {
        /*font-weight: bold;*/
        text-transform: uppercase;
        /*background-color: #444;*/
    }
    .hovermenu {
        visibility: hidden;
    }

</style>

    <div class="{level==0?"sb-tree-wrapper":""}">

{#each data as item (path+item.text+"/")}
    <div class="mb-0 item {item.nodes?"folder":"file"} {level==0?"sb-tree-level0":""} {(item.path==cursor)?"cursor":""}" role="button" tabindex="0" 
        on:click={updown(item)} 
        on:dblclick={updown(item,true)}
        on:keydown={updown(item)}
        on:contextmenu|preventDefault={(e)=>ctxm(e,item, path+item.text)}
        draggable=true
        on:dragstart={handleDragStart}
		on:dragend={handleDragEnd}

        on:dragenter={handleDragEnter} 
        on:dragleave={handleDragLeave}  
        on:drop|preventDefault={handleDragDrop} 
        data-p={item.nodes?(path+item.text):path.substring(0,path.length-1)}
        data-f={path+item.text}

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
            <svelte:self cursor={cursor} data={item.nodes} level={level+1} path={path+item.text+"/"} on:ctxm={raiseCtxm} on:openFile={raiseOpenFile} on:move={raiseEvent}/>
        </div>
    {/if}
{/each}

    </div>
    