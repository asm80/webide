import { dialogs } from "svelte-dialogs";
import {fixForSave, extractDir, extractFilename, replaceFilename, replaceExtension} from "$util/files.js"


export const ctxAction = async (event, tabsOpened, data, rebuildTree) => {
    let {action, path, itemType} = event.detail
    let dir;
    let name;
    switch (action) {
        case "deleteitem":
            
            let result = await dialogs.confirm("Are you sure you want to delete '"+fixForSave(path)+"'?", "Delete file")
            if (!result) return
            console.log("Delete item", path, result)
            if (itemType == "file") {
                await data.fs.unlink(fixForSave(path))
            } else {
                let filelist = await data.fs.readdir(fixForSave(path))
                console.log("To Delete", filelist)
                for (let fn of filelist) {
                    await data.fs.unlink(fixForSave(path+"/"+fn))
                }
                
            }
            //remove path from tabs, if there is
            tabsOpened = tabsOpened.filter(t => t.path != path)
            rebuildTree()
            break;
        case "additem":
            dir = path;
            if (itemType == "file") {
                dir = extractDir(path)
            }
            name = await dialogs.prompt("File name", {title:"Create file in "+(dir), submitButtonText:"Create", resetButton:false})
            if (!name) return
            console.log("Add item", name)
            await data.fs.writeFile(fixForSave(dir+"/"+name), "")
            rebuildTree()
            break;
        case "addfolder":
            dir = path;
            if (itemType == "file") {
                dir = extractDir(path)
            }
            name = await dialogs.prompt("File name", {title:"Create folder in "+(dir), submitButtonText:"Create", resetButton:false})
            if (!name) return
            await data.fs.writeFile(fixForSave(dir+"/"+name+"/..empty"), "")
            rebuildTree()
            break;
        case "rename":

            name = await dialogs.prompt("New name", {title:"Rename "+extractFilename(path), submitButtonText:"Rename", resetButton:false})
            if (!name) return
            let newPath = replaceFilename(path, name)
            console.log("rename item", path, newPath)
            await data.fs.rename(fixForSave(path), fixForSave(newPath))
            rebuildTree(true)
            break;
    }
}