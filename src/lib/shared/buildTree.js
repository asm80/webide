//converts file list to tree data for treeview

let expandedFolders = {}
import { fixForSave } from '$util/files.js'

export const setExpanded = (path, expandedState) => {
    expandedFolders[path] = expandedState
    console.log("setExpanded",path,expandedState)
}

const buildOneLevel = async (filelist, path,fs) => {
//remove duplicates from filelist
    filelist = [...new Set(filelist)].sort((a,b) => a.localeCompare(b))


    let tree = []

    //directories first

    for (let file of filelist) {
        
        if (file.endsWith("/")) {
            let expanded = false
            let folder = path+file
            console.log("Checking expanded",folder,expandedFolders[folder],expandedFolders)
            if (expandedFolders[folder]) {
                expanded = true
            }
            let subList = await fs.readdir(fixForSave(folder))
            console.log("sublist",folder, subList)
            let subTree = await buildOneLevel(subList, folder,fs)
            tree.push({icon: "fa-regular fa-folder", text: file.substr(0,file.length-1), nodes: subTree, expanded: expanded})
        }
    }    

    //then files
    
    for (let file of filelist) {
        if (file.startsWith("..")) continue
        if (!file.endsWith("/")) {
            tree.push({icon: "fa-regular fa-file", text: file, path: path+file})
        }
    }
    return tree
}

export const buildTree = async (fileList, fs, project) => {

    console.log("buildTree Now")

    let projectName = project.name
    let projectPath = `/${projectName}/`

     let tree = await buildOneLevel(fileList, projectPath,fs)
 
    //default data
    const treeData = [
        {   
            text:projectName,
            hoverMenu: true,
            nodes: tree,
            expanded:true,
            disableCtx: true,
            path:projectPath,
            id: "project"
        },
        {
            text: "Project",
            icon: "fa-regular fa-folder",
            disableCtx: true,
            title: "Open project",
            appLayout: "projectSelector"
        },
        {
            disableCtx: true,
            text: "Online"
        },
        {
            disableCtx: true,
            text: "Terminal"
        },
        {
            disableCtx: true,
            text: "Demos"
        },
        {
            disableCtx: true,
            text: "Settings"
        }
    ];

    console.log(treeData)

    return treeData
}