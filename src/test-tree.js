export const treeData = [
        {text:"My Project",
        hoverMenu: true,
                    nodes: [
                                                        {
                                                            icon: "fa-regular fa-file",
                                                            text: "project.toml"
                                                        },
                        {
                            text: "src",
                            icon: "fa-regular fa-folder",
                            nodes: [
                                {
                                    icon: "fa-regular fa-file",
                                    text: "test.a80"
                                },
                                {
                                    icon: "fa-regular fa-file",
                                    text: "include.a80"
                                }
                            ]
                        },
                        {
                            icon: "fa-regular fa-folder",
                            text: "obj",
                            nodes: [
                                                            {
                                                                icon: "fa-regular fa-file",
                                                                text: "test.a80.obj"
                                                            },
                                                            {
                                                                icon: "fa-regular fa-file",
                                                                text: "include.a80.obj"
                                                            }
                                                        ]
                        }
                    ]
        
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

    