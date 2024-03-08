//project files store

// a copy of project filesystem is stored in this store,
// this store is used to display the project filesystem in the file explorer
// and to manage the project filesystem
// it holds filenames, its contents and some flags ("dirt" etc.)

// it is Svelte writable store with some additional methods
// 1. it has to be initialized with a project filesystem
// 2. it has to write all changes back to the project filesystem
// 3. it provides file content to editor component

import { writable } from 'svelte/store';
import { get } from 'svelte/store';

// this is the project filesystem
// it is a flat object, no folders, just "/" in file names

let test = {
    "test.a80": "test",
    "include.a80": "include"
    "obj/test.obj": "AnyBinaryData"
}

export const fileStore = writable(test,() => {
	console.log('got a subscriber');
	return () => console.log('no more subscribers');
});