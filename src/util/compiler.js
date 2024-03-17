import {compileFromFile, lst, ihex} from "@asm80/core"

const compiler = async (name, fs) => {

    console.log("Compiling",name)
    let result = await compileFromFile(name, fs, {assembler:"I8080"})

    let listing = lst(result, true, false)
    let hex = ihex(result)

    return {hex, lst:listing}
}

export const compile = async (file, fs) => {
    let fakeFS = {
        readFile: async (name) => {
            if (typeof files[name] == "undefined") throw new Error("File not found")
            return files[name]
        },
    }
    
    let res = await compiler(file,fakeFS)
    return res
}