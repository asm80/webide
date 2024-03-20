import { writable } from 'svelte/store';

let defaultProject = {
    name:"My Project",
    ide: {
        size:"medium"
    },
    needInit: true
}
export const projectStore = writable(defaultProject)

projectStore.subscribe(value => {
    console.log("Project changed",value)
})