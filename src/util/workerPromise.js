//worker promise - we need store the promise, pair worker with it, pass promise ID back and then resolve it

let promiseStore = {}

const generateId = () => {
    let id = Math.floor(Math.random() * 1000000)
    if (typeof promiseStore[id]!="undefined") return generateId()
    return id
}

const workerMessageProcessing = (data) => {
    let {workerId, ...message} = data
    if (typeof promiseStore[workerId] != "undefined") {
        if (message.error) {
            promiseStore[workerId].reject(message.error)
        } else {
            promiseStore[workerId].resolve(message)
        }
        delete promiseStore[workerId]
    }
}

let compilerWorker = null
const workerInit = async (workerFile) => {
    const CompilerWorker = (await import(workerFile)).default;
    compilerWorker = new CompilerWorker()
    compilerWorker.onmessage = (e) => {
        workerMessageProcessing(e.data)
    }
}

const postMessage = (message) => {
    // generate promise id
    let workerId = generateId()
    // create promise
    let promise = new Promise((resolve, reject) => {
        promiseStore[workerId] = {resolve, reject}
    })
    // send message to worker
    compilerWorker.postMessage({workerId: workerId, ...message})
    return promise
}

export default {workerInit, postMessage}