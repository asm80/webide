<script>

    export let data;
    export let level=0;

    const showLevel = (level) => {
        for (let item of data) {
            if (item.level === level) {
                console.log(item)
            }
        }
    }
</script>

<style>
    .sb-tree-wrapper {
        border: 1px solid #ccc;
        border-radius: 5px;
    }
    .sb-tree-wrapper div {
        padding: 5px;
    }
    .sb-tree-wrapper div:hover {
        background-color: #f0f0f0;
    }
    .sb-tree-wrapper i {
        margin-right: 5px;
    }
</style>


    <div class="{level==0?"sb-tree-wrapper":""}">


{#each data as item, index}
    <div><i class={item.icon}></i>&nbsp;{item.text} [{index}]</div>
    {#if item.nodes}
        <div style="margin-left:12px">
            <svelte:self data={item.nodes} level={level+1}/>
        </div>
    {/if}
{/each}

    </div>
