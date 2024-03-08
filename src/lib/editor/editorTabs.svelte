<script>
export let tabsOpened;

import { createEventDispatcher } from "svelte";

const lastElementOfFileName = (fn) => {
    let parts = fn.split("/");
    return parts[parts.length-1];
}
/*
const selectTab = (tab) => {
    for (let t of tabsOpened) {
        t.active = false;
    }
    tab.active = true;
    tabsOpened = tabsOpened;
}
*/
const dispatch = createEventDispatcher();

const selectTab = (tab) => {
    dispatch("selectTab", tab);
}
</script>

<div class="tabs is-boxed is-small pb-0 mb-0" id="fileTabs">
    <ul>
        {#each tabsOpened as tab}
            <li class="{tab.active?'is-active':''}"><a on:click={() => selectTab(tab)}>{lastElementOfFileName(tab.fn)}</a></li>
        {/each}
    </ul>
  </div>