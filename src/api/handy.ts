'use server'

import { BeatState } from "@/component/start/BeatFactory"
import { Handy__ProductionHost } from "./utils"

export  const API__CheckHandyConnect = async (xConnectedKey: string)=>{
    // console.log(`${Handy__ProductionHost}/connected`)
    let connected = await fetch(`${Handy__ProductionHost}/connected`, {
        headers: {
            "X-Connection-Key": xConnectedKey,
        },
        next:{
            revalidate: 0
        },
        method: "GET"
    }).then(ret=>{
        if( ret.status == 200){
            return ret.json()
        }else{
            throw new Error("status: "+ret.status)
        }
    }).then(jsonObj=>{
        // console.log("connected result: ", jsonObj)
        if(jsonObj["connected"] == true){
            return true
        }else{
            return false
        }
    }).catch(e=>{
        console.log("err: ",e)
        return false
    })
    return connected
}


export  const API__SetHandyStrokeMode = async (xConnectedKey: string)=>{
    // console.log(`${Handy__ProductionHost}/mode`,xConnectedKey)
    let modeSuccessed = await fetch(`${Handy__ProductionHost}/mode`, {
        headers: {
            "X-Connection-Key": xConnectedKey,
            "Content-Type": "application/json",
        },
        next:{
            revalidate: 0
        },
        method: "PUT",
        body: JSON.stringify({
            "mode": 0,
        }),
    }).then(ret=>{
        if( ret.status == 200){
            return ret.json()
        }else{
            throw new Error("status: "+ret.status)
        }
    }).then(jsonObj=>{
        return true
    }).catch(e=>{
        console.log("err: ",e)
        return false
    })
    return modeSuccessed
}


export  const API__SetHandyVelocity = async (xConnectedKey: string, velocity: number)=>{
    console.log(`${Handy__ProductionHost}/hamp/velocity`, xConnectedKey, velocity)
    let modeSuccessed = await fetch(`${Handy__ProductionHost}/hamp/velocity`, {
        headers: {
            "X-Connection-Key": xConnectedKey,
            "Content-Type": "application/json",
        },
        next:{
            revalidate: 0
        },
        method: "PUT",
        body: JSON.stringify({
            "velocity": velocity,
        }),
    }).then(ret=>{
        if( ret.status == 200){
            return ret.json()
        }else{
            throw new Error("status: "+ret.status)
        }
    }).then(jsonObj=>{
        return true
    }).catch(e=>{
        console.log("err: ",e)
        return false
    })
    return modeSuccessed
}

export  const API__SetHandyStartStroke = async (xConnectedKey: string)=>{
    console.log(`${Handy__ProductionHost}/hamp/start`)
    let modeSuccessed = await fetch(`${Handy__ProductionHost}/hamp/start`, {
        headers: {
            "X-Connection-Key": xConnectedKey,
        },
        next:{
            revalidate: 0
        },
        method: "PUT"
    }).then(ret=>{
        if( ret.status == 200){
            return ret.json()
        }else{
            throw new Error("status: "+ret.status)
        }
    }).then(jsonObj=>{
        return true
    }).catch(e=>{
        console.log("err: ",e)
        return false
    })
    return modeSuccessed
}
export  const API__GetHandyState = async (xConnectedKey: string)=>{
    console.log(`${Handy__ProductionHost}/hamp/state`)
    let modeSuccessed = await fetch(`${Handy__ProductionHost}/hamp/state`, {
        headers: {
            "X-Connection-Key": xConnectedKey,
        },
        next:{
            revalidate: 0
        },
        method: "GET"
    }).then(ret=>{
        if( ret.status == 200){
            return ret.json()
        }else{
            throw new Error("status: "+ret.status)
        }
    }).then(jsonObj=>{
        return jsonObj["state"] == 2 ? true : false
    }).catch(e=>{
        console.log("err: ",e)
        return false
    })
    return modeSuccessed
}
export  const API__SetHandyStopStroke = async (xConnectedKey: string)=>{
    console.log(`${Handy__ProductionHost}/hamp/stop`)
    let modeSuccessed = await fetch(`${Handy__ProductionHost}/hamp/stop`, {
        headers: {
            "X-Connection-Key": xConnectedKey,
        },
        next:{
            revalidate: 0
        },
        method: "PUT"
    }).then(ret=>{
        if( ret.status == 200){
            return ret.json()
        }else{
            throw new Error("status: "+ret.status)
        }
    }).then(jsonObj=>{
        return true
    }).catch(e=>{
        console.log("err: ",e)
        return false
    })
    return modeSuccessed
}

export  const API__SetHandySlide = async (xConnectedKey: string, max: number ,min: number)=>{
    console.log(`${Handy__ProductionHost}/slide`,xConnectedKey,min,max)
    let modeSuccessed = await fetch(`${Handy__ProductionHost}/slide`, {
        headers: {
            "X-Connection-Key": xConnectedKey,
            "Content-Type": "application/json",
        },
        next:{
            revalidate: 0
        },
        method: "PUT",
        body:JSON.stringify({
            "min": min,
            "max": max
        })
    }).then(ret=>{
        if( ret.status == 200){
            return ret.json()
        }else{
            throw new Error("status: "+ret.status)
        }
    }).then(jsonObj=>{
        console.log("jsonObj",jsonObj)
        return true
    }).catch(e=>{
        console.log("err: ",e)
        return false
    })
    return modeSuccessed
}