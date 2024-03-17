export const replaceFilename = (path, newFilename) => {
    let parts = path.split("/")
    parts[parts.length-1] = newFilename
    return parts.join("/")
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

export const fixForSave = (path) => removeFirstDir(removeLeadingSlash(path))