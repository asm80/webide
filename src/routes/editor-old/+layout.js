import { FileSystem } from '@asm80/filesystem';
import { StoreFS } from '$lib/shared/fsconn.js';



export const ssr = false;

export const load = async({request, resolve, data}) => {

    //init fs
    let fs;
    let lsconn
        //console.log(window.localStorage)
        lsconn = new StoreFS();
        fs = new FileSystem(lsconn);
    
    return {
        ...data,
        fs,
        localStorage:lsconn
    }
}