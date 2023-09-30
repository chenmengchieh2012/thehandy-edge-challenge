import { SettingProps } from "@/store/SettingProp"
import { RunningStatus, RunningStatusAction } from "@/store/StatusStore"
import { useCallback, useEffect, useState } from "react"

export interface StatusDecoratorAction {
    start: ()=>void
    stop: ()=>void
    addOrgams: ()=>void
    addEdge: ()=>void
    setEdgeLevel: (edgeLevel: number)=>void
}
export const MAX_EDGE_LEVEL = 8

const StatusDecorator = (ctx: RunningStatusAction):StatusDecoratorAction =>{
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
        start,stop,addEdge,addOrgams,setEdgeLevel
    }
}

export default StatusDecorator