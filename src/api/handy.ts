'use server'

import { Handy__ProductionHost } from "./utils"

export  const API__CheckHandyConnect = async (xConnectedKey: string)=>{
    console.log(`${Handy__ProductionHost}/connected`)
    let connected = await fetch(`${Handy__ProductionHost}/connected`, {
        headers: {
            "X-Connection-Key": xConnectedKey,
        },
        method: "GET"
    }).then(ret=>{
        if( ret.status == 200){
            return ret.json()
        }else{
            throw new Error("not found server")
        }
    }).then(jsonObj=>{
        console.log("connected result: ", jsonObj)
        if(jsonObj["connected"] == true){
            return true
        }else{
            return false
        }
    }).catch(e=>{
        console.log("server not connect",e)
        return false
    })
    return connected
}