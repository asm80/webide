import { Alert, Prompt } from "$lib/dialogs";
import {fixForSave, extractDir, extractFilename, replaceFilename, replaceExtension} from "$util/files.js"
import { projectStore } from "$lib/shared/stores/project.js"
import { get } from "svelte/store"

import JSZip from "jszip"

const NonbinaryFiles = [
    "asm","a80","txt","a68","a09","z80","bas","c","cpp","h","hpp","inc","s",
    "hex","srec","c65","lst","md"
]

const checkExt = (filename) => {
    let ext = filename.split(".").pop().toLowerCase()
    return NonbinaryFiles.includes(ext)
}

const isbinToBufer = (file) => {
    //convert to binary
    let uint8 = []
    for (let i=0; i<file.length; i++) {
        if (file.substr(i,1) == "\\") { //treat backslash
            let s = file.substr(i+1,2)
            uint8.push(parseInt(s,16))
            i+=2
        } else {
            uint8.push(file.charCodeAt(i))
        }
    }
    file = new Uint8Array(uint8)
    return file
}


export const ctxAction = async (event, tabsOpened, data, rebuildTree) => {
    let {action, path, itemType} = event.detail
    let dir;
    let name;
    switch (action) {
        case "deleteitem":
            
            let result = await Alert("Are you sure you want to delete '"+fixForSave(path)+"'?", "Delete file")
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
            name = await Prompt("File name", {title:"Create file in "+(dir), submitButtonText:"Create", resetButton:false})
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
            name = await Prompt("File name", {title:"Create folder in "+(dir), submitButtonText:"Create", resetButton:false})
            if (!name) return
            await data.fs.writeFile(fixForSave(dir+"/"+name+"/..empty"), "")
            rebuildTree()
            break;
        case "rename":

            name = await Prompt("New name", {title:"Rename "+extractFilename(path), submitButtonText:"Rename", resetButton:false})
            if (!name) return
            let newPath = replaceFilename(path, name)
            console.log("rename item", path, newPath)
            await data.fs.rename(fixForSave(path), fixForSave(newPath))
            rebuildTree(true)
            break;
        case "download":
            let project = get(projectStore)
            console.log("Download", path, itemType, project)
            if (itemType == "folder") {
                //we'll zip it
                
                let filelist = await data.fs.readdir(fixForSave(path), true, true)
                console.log("To Zip", filelist)
                let zip = new JSZip()
                for (let fn of filelist) {
                    if (fn.indexOf("..empty")>=0) continue
                    let addFile = fn.toString()
                    let file = await data.fs.readFile(addFile)
                    if (fn.indexOf(".isbin")>=0) {
                        file = isbinToBufer(file)
                        fn = fn.replace(".isbin","")
                    }
                    zip.file(fn, file)
                }
                let content = await zip.generateAsync({type:"blob"})
                let url = URL.createObjectURL(content)
                let a = document.createElement("a")
                a.href = url
                a.download = (path=="/"?project.name:extractFilename(path))+".zip"
                a.click()
                break;
            } else {
                let file = await data.fs.readFile(fixForSave(path))
                if (path.indexOf(".isbin")>=0) {
                    file = isbinToBufer(file)
                    path = path.replace(".isbin","")
                }
                let blob = new Blob([file], {type: "application/octet-stream"})
                let url = URL.createObjectURL(blob)
                let a = document.createElement("a")
                a.href = url
                a.download = extractFilename(path)
                a.click()
            }
            
            break;
        case "upload":
            let files = event.detail.files
            console.log("Upload", files)
            for (let file of files) {
                let reader = new FileReader()
                let text = checkExt(file.name)
                if (text) {
                    reader.onload = async (e) => {
                        let result = reader.result
                        let name = file.name
                        await data.fs.writeFile(fixForSave(path+"/"+name), result)
                    }
                    reader.readAsText(file)
                } else {
                    reader.onload = async (e) => {
                        let result = reader.result

                        let uint8 = new Uint8Array(result)
                        // convert UINT8 to string. All chars < 128 convert to chars, others to \HH
                        let fileData = ""
                        for (let i=0; i<uint8.length; i++) {
                            if ((uint8[i] < 128 && uint8[i] > 31) || uint8[i] == 10 || uint8[i] == 13 || uint8[i] == 9) {
                                fileData += String.fromCharCode(uint8[i])
                            } else {
                                let s = uint8[i].toString(16)
                                if (s.length < 2) s = "0"+s
                                fileData += "\\"+s
                            }
                        }

                        let name = file.name
                        await data.fs.writeFile(fixForSave(path+"/"+name+".isbin"), fileData)
                    }
                    reader.readAsArrayBuffer(file)
                }
            }
            rebuildTree()
            break;
    }
}