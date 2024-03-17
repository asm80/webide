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
const closeTab = (tab) => {
    dispatch("closeTab", tab);
    /*
    tabsOpened = tabsOpened.filter(t => t.fn != tab.fn); 
    //console.log("Close tab", tab, tabsOpened)
    tabsOpened = tabsOpened; //do reactivity things
    */
}
</script>

<style>
    
    .dangling a {
        font-style: italic;
        color: #ddd
    }
    .is-active.dangling a {
        font-style: italic;
        color: gold
    }
    
    .tabs li a i {
        width:10px
    }
    
    .tabs li a i.fa-xmark {
        color: #222
    }
    .tabs li:hover a:hover i {
         color:#ddd
    }

    .tabs li:hover a:hover i.fa-circle {
         display:none;
    }
    .tabs li:hover a:hover i.fa-xmark {
         display:inline;
    }

    .tabs li a i.fa-circle {        
        display:none
    }

    .tabs li.dirty a i.fa-xmark {
        display:none
    }    
    .tabs li.dirty a i.fa-circle {
        display:inline
    }    
</style>

<div class="tabs is-boxed is-small pb-0 mb-0" id="fileTabs">
    <ul>
        {#each tabsOpened as tab}
            <li class="{tab.active?'is-active':''} {tab.dangling?"dangling":""} {tab.dirty?"dirty":""}">
                <a 
                on:click={() => selectTab(tab)}
                on:keydown={(e) => {if (e.key == "Enter") selectTab(tab)}}
                role="button"
                tabindex="{tab.active?0:-1}"
                title={tab.path}
                href="/"
                    >{lastElementOfFileName(tab.path)}&nbsp;<i 
                    on:click={()=>closeTab(tab)} 
                    on:keydown={(e) => {if (e.key == "Enter") closeTab(tab)}}
                    role="button"
                    tabindex="{tab.active?0:-1}"
                    class="fa-solid fa-xmark"
                    ></i><i class="fa-solid fa-circle"></i></a>
            </li>
        {/each}
    </ul>
  </div>