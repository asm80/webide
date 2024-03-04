$(function () {

    var json = [
        {
            text: "Source",
            icon: "fa-regular fa-folder",
            nodes: [
                {
                    text: "asm",
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
                    text: "obj"
                }
            ]
        },
        {
            icon: "fa fa-archive fa-fw",
            text: "Drafts"
        },
        {
            icon: "fa fa-calendar fa-fw",
            text: "Calendar"
        },
        {
            icon: "fa fa-address-book fa-fw",
            text: "Contacts"
        },
        {
            icon: "fa fa-trash fa-fw",
            text: "Deleted Items"
        },
        {
            icon: "fa fa-archive fa-fw",
            text: "Drafts"
        },
        {
            icon: "fa fa-calendar fa-fw",
            text: "Calendar"
        },
        {
            icon: "fa fa-address-book fa-fw",
            text: "Contacts"
        },
        {
            icon: "fa fa-trash fa-fw",
            text: "Deleted Items"
        },
        {
            icon: "fa fa-archive fa-fw",
            text: "Drafts"
        },
        {
            icon: "fa fa-calendar fa-fw",
            text: "Calendar"
        },
        {
            icon: "fa fa-address-book fa-fw",
            text: "Contacts"
        },
        {
            icon: "fa fa-trash fa-fw",
            text: "Deleted Items"
        },
        {
            icon: "fa fa-globe fa-fw",
            text: "Go to Google",
            class: "text-info",
            //href: "https://google.com"
        }
    ];

    $('#tree').bstreeview({
        data: json,
        expandIcon: 'fa fa-angle-down fa-fw',
        collapseIcon: 'fa fa-angle-right fa-fw',
        indent: 1.25,
        parentsMarginLeft: '1.25rem',
        openNodeLinkOnNewTab: true
    });
});