import {recountOrders, findMaxOrder} from "$util/tabs.js"
import { fixForSave } from "../../util/files"

import { ctxAction } from "./contextMenu.js"

const buttonTest = async (appContext) => {
    console.log("Button test")
    /*
    console.log($page.data.session)
    let sess = $page.data.session
    let user = sess.user
    const res = await fetch(`/api/${user.userName}/MyProject/file/1/hejhola/vola.asm80`);
    const item = await res.text();
    console.log(item)
    */
    let tabsOpened = appContext.tabsOpened
    console.log(tabsOpened)
    return;
    let fs = get(localfs)
    compilerWorker.postMessage( {msg:"compile",file:"test.a80", fs:fs})
    console.log("Posted")
    //let asm = await compile("test.a80", fs)
    //console.log(s)
}

const closeTab = (event, tabsOpened) => {
    let tab = event.detail
    tabsOpened = tabsOpened.filter(t => t.path != tab.path); 
    console.log("Close tab", tab, tabsOpened)
    recountOrders(tabsOpened)
    //activate tab with highest order
    let max = findMaxOrder(tabsOpened)
    let newActive = tabsOpened.filter(t => t.order == max)[0]
    if (newActive) {
        newActive.active = true
        //editorText = tab.data;
    }
    return tabsOpened
}

const deactivateAllTabs = (tabsOpened) => {
    tabsOpened = tabsOpened.map(t => {t.active = false; return t})
}

let couldBeDblClick = false

const openFile = async (e, tabsOpened, cursor, data) => {
    let isDoubleClick = false
    
    if (!couldBeDblClick) {
        couldBeDblClick = true
        setTimeout(() => {
            couldBeDblClick = false
        }, 300)
    } else {
        isDoubleClick = true
        couldBeDblClick = false
    }
    
    //console.log("CLICK:Open file", e.detail, isDoubleClick?"dbl":"single")
    if (isDoubleClick) {
        //undngling
        let active = tabsOpened.filter(t => t.active)[0]
        if (active) {
            if (active.dangling) {
                active.dangling = false
                return {tabsOpened, cursor}
            }
        }
        return {tabsOpened, cursor}
    }
    let item = e.detail.item
    let force = e.detail.force
    let path = e.detail.path
    deactivateAllTabs(tabsOpened)

    let newData = "";
    try {
        console.log("Reading file", item, fixForSave(item.path))
        newData = await data.fs.readFile(fixForSave(item.path))
    } catch (e) {
        console.log(e);
    }
    //console.log("newData", newData)
    console.log("before", tabsOpened)

    let newOrder = findMaxOrder(tabsOpened) + 1

    //if there is a tab with this file (by path), just active it!
    let found = tabsOpened.filter(t => t.path == path)
    if (found.length > 0) {
        console.log("Found Just Switch Tabs", found)
        deactivateAllTabs(tabsOpened)
        found[0].active = true
        found[0].justOpened = true
        tabsOpened = tabsOpened
        cursor = found[0].path
        return {tabsOpened, cursor}
    }


    //if there is a dangling tab and not forced, replace it, else push new tab
    if (tabsOpened.filter(t => t.dangling).length > 0 && !force) {
        deactivateAllTabs(tabsOpened)
        console.log("Replace Dangling Tab")
        tabsOpened = tabsOpened.map(t => {
            if (t.dangling) {
                t.fn = item.text
                t.data = newData
                t.active = true
                t.justOpened = true;
                t.path = path
                cursor = path
            }
            return t
        })
        //return {tabsOpened, cursor}
    } else 
    {
        deactivateAllTabs(tabsOpened)
        console.log("Push New Tab")
        tabsOpened.push({
            fn: item.text, 
            data: newData, 
            active:true, 
            justOpened:true, 
            path: path,
            order: newOrder,
            dangling: true
        })
        cursor = path
    }
    return {tabsOpened, cursor}
}

export default {
    buttonTest,
    closeTab,
    openFile,
    ctxAction
}

