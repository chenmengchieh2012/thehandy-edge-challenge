'use client'

import React, { useCallback, useRef } from "react";

export interface RunningStatus{
    startTime: number
    currentOrgasm: number
    currentEdgeTimes: number
    currentEdgeLevel: number
}

type Func_StatusRegistry = (status: RunningStatus)=>void
type Func_StatusSetting = (preStatus: RunningStatus)=>RunningStatus

export interface RunningStatusAction {
    registry: ( cb: Func_StatusRegistry ) => void,
    setStatus: ( cb: Func_StatusSetting) => void,
    getStatus: () => RunningStatus|void,
}

export const ctxRunningStatusStore = React.createContext<RunningStatusAction>({
    registry: ( cb: Func_StatusRegistry ) => {},
    setStatus: (cb: Func_StatusSetting) => {},
    getStatus: ():RunningStatus|void => { },
});

export const BaseRunningStatusProps = {
    startTime: 0,
    currentOrgasm: 0,
    currentEdgeTimes: 0,
    currentEdgeLevel: 1,
}

const VRunningStatusContext = (props: {children: JSX.Element })=>{
    let runningStatusRef = useRef<RunningStatus>(BaseRunningStatusProps) 
    let registryRef = useRef<((status: RunningStatus)=>void)[]>([])
    let registry = useCallback((cb: Func_StatusRegistry)=>{
        registryRef.current.push(cb)
    },[])
    let setStatus = useCallback((cb: Func_StatusSetting)=>{
        let nextStatus = cb(runningStatusRef.current)
        registryRef.current.forEach(cb=>{
            cb(nextStatus)
        })
        runningStatusRef.current = nextStatus
    },[])
    let getStatus = useCallback(():RunningStatus=>{
        return runningStatusRef.current
    },[])
    return <>
        <ctxRunningStatusStore.Provider value={{registry,setStatus,getStatus}}>
            {props.children}
        </ctxRunningStatusStore.Provider>
    </>
}
export default VRunningStatusContext