<script>

    export let data;
    export let level=0;

    let options = {
        expandIcon: 'fa fa-angle-down fa-fw',
        collapseIcon: 'fa fa-angle-right fa-fw',
        expandClass: 'show',
        indent: 1.25,
        parentsMarginLeft: '1.25rem',
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
    .sb-tree-wrapper div:hover {
        background-color: #333;
    }
    .sb-tree-wrapper i {
        margin-right: 5px;
    }
</style>


    <div class="{level==0?"sb-tree-wrapper":""}">


{#each data as item, index}
    <div>
        {#if item.nodes}
            <i class={item.expanded?options.expandIcon:options.collapseIcon} on:click={updown(item)}></i>
        {/if}
        <i class={item.icon}></i>&nbsp;{item.text}
        [{index}]
    </div>
    {#if item.nodes}
        <div style="margin-left:{options.parentsMarginLeft}">
            <svelte:self data={item.nodes} level={level+1}/>
        </div>
    {/if}
{/each}

    </div>
