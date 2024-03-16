import { browser } from '$app/environment';
import { writable } from 'svelte/store';

let defaultValue = JSON.stringify({files:{},times:{}})
let init = browser ? window.localStorage.getItem("fs") : defaultValue

export const localfs = writable(init)

localfs.subscribe(value => {
    if (browser) {
        window.localStorage.setItem("fs", value)
    }
})

