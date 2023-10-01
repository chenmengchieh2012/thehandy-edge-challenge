import { SettingProps } from "@/store/SettingProp"
import { RunningStatus, RunningStatusAction } from "@/store/StatusStore"
import { useCallback, useEffect, useRef, useState } from "react"

export interface StatusDecoratorAction {
    start: ()=>void
    stop: ()=>void
    pause: ()=>void
    resume: ()=>void
    addOrgams: ()=>void
    addEdge: ()=>void
    setEdgeLevel: (edgeLevel: number)=>void
}
export const MAX_EDGE_LEVEL = 8

const StatusDecorator = (ctx: RunningStatusAction):StatusDecoratorAction =>{
    let pauseTimeRef = useRef<number>(0)
    let start  = useCallback(()=>{
        ctx.setStatus(prevStatus=>{
            prevStatus.startTime = new Date().getTime()
            return {...prevStatus}
        })
    },[ctx])
    let stop  = useCallback(()=>{
        ctx.setStatus(prevStatus=>{
            prevStatus.startTime = 0
            prevStatus.currentEdgeLevel = 1
            prevStatus.currentOrgasm = 0
            prevStatus.currentEdgeTimes = 0
            return {...prevStatus}
        })
    },[ctx])
    let pause = useCallback(()=>{
        pauseTimeRef.current = new Date().getTime()
    },[])
    let resume = useCallback(()=>{
        let duration = new Date().getTime() - pauseTimeRef.current 
        ctx.setStatus(prevStatus=>{
            prevStatus.startTime = prevStatus.startTime + duration
            return {...prevStatus}
        })
    },[ctx])
    let addEdge = useCallback(()=>{
        ctx.setStatus(prevStatus=>{
            prevStatus.currentEdgeLevel = MAX_EDGE_LEVEL
            prevStatus.currentEdgeTimes += 1
            return {...prevStatus}
        })
    },[ctx])
    let addOrgams = useCallback(()=>{
        ctx.setStatus(prevStatus=>{
            prevStatus.currentEdgeLevel = 1
            prevStatus.currentOrgasm += 1
            return {...prevStatus}
        })
    },[ctx])
    let setEdgeLevel = useCallback((edgeLevel:number)=>{
        ctx.setStatus(prevStatus=>{
            prevStatus.currentEdgeLevel = edgeLevel
            return {...prevStatus}
        })
    },[ctx])

    return {
        start,stop,pause,resume,addEdge,addOrgams,setEdgeLevel
    }
}

export default StatusDecorator