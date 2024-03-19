// compiler worker

import {compileFromFile} from "@asm80/core"
import {ihex} from "@asm80/core/utils/ihex.js"
import {lst} from "@asm80/core/listing.js"

const compile = async (name, fs) => {

    console.log("Compiling",name)
    let result = await compileFromFile(name, fs, {assembler:"I8080"})

    let listing = lst(result, true, false)
    let hex = ihex(result)

    return {hex, lst:listing}

    /*
    let res = await fetch('https://api.wasmfiddle.com/compile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({name,src})
    })
    let data = await res.json()
    return data
    */
}

addEventListener('message', async (e) => {
    let {msg,file, fs, workerId} = e.data
    let files = JSON.parse(fs).files

    let fakeFS = {
        readFile: async (name) => {
            if (typeof files[name] == "undefined") throw new Error("File not found")
            return files[name]
        },
    }

    if (msg == "compile") {
        try {
            let res = await compile(file,fakeFS)
            postMessage({msg:"compiled",error:false,data:res, file,workerId})
        } catch (e) {
            postMessage({msg:"compiled",error:e.error, file, workerId})
        }
    }
})