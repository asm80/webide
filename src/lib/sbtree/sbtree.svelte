<script>

    import { slide } from "svelte/transition";
    export let data;
    export let level=0;

    let options = {
        expandIcon: 'fa fa-angle-down fa-fw',
        collapseIcon: 'fa fa-angle-right fa-fw',
        expandClass: 'show',
        indent: 1.25,
        parentsMarginLeft: '.55rem',
    }

    const showLevel = (level) => {
        for (let item of data) {
            if (item.level === level) {
                console.log(item)
            }
        }
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
</style>


    <div class="{level==0?"sb-tree-wrapper":""}">


{#each data as item, index}
    <div class="item {item.nodes?"folder":"file"}" role="button" tabindex="0" on:click={updown(item)} on:keydown={updown(item)}>
        {#if item.nodes}
            <i class={item.expanded?options.expandIcon:options.collapseIcon}></i>
        {/if}
        {item.text}
                <!--<i class={item.icon}></i>&nbsp;-->

    </div>
    {#if item.nodes && item.expanded}
        <div style="margin-left:{options.parentsMarginLeft}; border-left:1px dotted #444; padding-left:{options.parentsMarginLeft}" transition:slide>
            <svelte:self data={item.nodes} level={level+1}/>
        </div>
    {/if}
{/each}

    </div>
