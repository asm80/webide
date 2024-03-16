import { localfs } from '$lib/shared/stores/localfs.js';

export class StoreFS {
    #store;
    #files;
    #times;
    constructor() {
        this.#files = {}
        this.#times = {}
        this.#store = localfs

        //read all files from store, if...
        this.#store.subscribe(value => {
            if (!value) return
            console.log("LocalFS new value",value)
            try {
                let big = JSON.parse(value)
                console.log(big)
                if (!big) return
                this.#files = big.files
                this.#times = big.times
            } catch (e) {
                console.log("Error parsing localfs",e)
            }
        })
    }

    async _writeback() {
        let big = {files:this.#files,times:this.#times}
        this.#store.set(JSON.stringify(big))
    }

    async readFile(name) {
        if (typeof this.#files[name] == "undefined") throw new Error("File not found")
        return this.#files[name]
    }

    async writeFile(name, data) {
        this.#files[name] = data
        this.#times[name] = new Date().getTime()
        this._writeback()
    }

    async exists(name) {
        return this.#files[name] != undefined
    }

    async size(name) {
        if (typeof this.#files[name] == "undefined") throw new Error("File not found")
        return this.#files[name].length
    }

    async unlink(name) {
        if (typeof this.#files[name] == "undefined") throw new Error("File not found")
        delete this.#files[name]
        delete this.#times[name]
    }

    async rename(name, newName) {
        if (typeof this.#files[name] == "undefined") throw new Error("File not found")
        this.#files[newName] = this.#files[name]
        this.#times[newName] = this.#times[name]
        delete this.#files[name]
        delete this.#times[name]
    }

    async copyFile(name, newName) {
        if (typeof this.#files[name] == "undefined") throw new Error("File not found")
        this.#files[newName] = this.#files[name]
        this.#times[newName] = this.#times[name]
    }

    async readdir(name) {
        return Object.keys(this.#files)
    }

    async mtime(name) {
        if (typeof this.#files[name] == "undefined") throw new Error("File not found")
        return this.#times[name]
    }
}