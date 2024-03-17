//converts file list to tree data for treeview

let expanded = {}

export const setExpanded = (path, expandedState) => {
    expanded[path] = expandedState
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
            console.log("Checking expanded",folder,expanded[folder+"/"])
            if (expanded[folder+"/"]) {
                expanded = true
            }
            let subList = await fs.readdir(folder)
            let subTree = await buildOneLevel(subList, folder,fs)
            tree.push({icon: "fa-regular fa-folder", text: file.substr(0,file.length-1), nodes: subTree, expanded: expanded})
        }
    }    

    //then files
    
    for (let file of filelist) {
        if (!file.endsWith("/")) {
            tree.push({icon: "fa-regular fa-file", text: file})
        }
    }
    return tree
}

export const buildTree = async (fileList,fs) => {

     let tree = await buildOneLevel(fileList, "",fs)
 
    //default data
    const treeData = [
        {   
            text:"My Project",
            hoverMenu: true,
            nodes: tree,
            expanded:true,
            id: "project"
        },
        {
            text: "Workspace",
            icon: "fa-regular fa-folder",
            title: "Open workspaces"
        },
        {
            icon: "fa fa-archive fa-fw",
            text: "Online"
        },
        {
            icon: "fa fa-calendar fa-fw",
            text: "Terminal"
        },
        {
            icon: "fa fa-address-book fa-fw",
            text: "Demos"
        },
        {
            icon: "fa fa-trash fa-fw",
            text: "Settings"
        }
    ];

    console.log(treeData)

    return treeData
}