// single file store
import { writable } from 'svelte/store';
import { get } from 'svelte/store';

// this is the project filesystem
// it is a flat object, no folders, just "/" in file names


export const singleFile = writable({fn:"",data:"", dirty:false},() => {
	console.log('got a subscriber');
	return () => console.log('no more subscribers');
});