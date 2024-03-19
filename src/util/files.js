export const replaceFilename = (path, newFilename) => {
    let parts = path.split("/")
    parts[parts.length-1] = newFilename
    return parts.join("/")
}

export const replaceExtension = (path, newExtension) => {
    let parts = path.split(".")
    parts.pop()
    return parts.join(".") + "." + newExtension
}

export const removeLeadingSlash = (path) => {
    if (path.startsWith("/")) {
        return path.substr(1)
    }
    return path
}

export const removeFirstDir = (path) => {
    let parts = path.split("/")
    let p0 = parts.shift()
    return parts.join("/")
}

export const extractDir = (path) => {
    let parts = path.split("/")
    parts.pop()
    return parts.join("/")
}

export const extractFilename = (path) => {
    let parts = path.split("/")
    return parts[parts.length-1]
}

export const fixForSave = (path) => removeFirstDir(removeLeadingSlash(path))