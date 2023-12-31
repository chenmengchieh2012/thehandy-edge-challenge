'use client'
import React, { useCallback, useRef } from "react";
import { TagName__Setting, ctxTagStore } from "./TagStore";


export const MAX_BEAT = 180
export const MIN_BEAT = 30

export interface SettingProps {
    OrgamsTimes : number
    PreferOrgasmPeriod : number //min
    EdgeTimes: number
    RelexPeriod :number
    PostOrgasmTortureMinPeriod: number
    PostOrgasmTortureMaxPeriod: number
    MinBeatInput: number
    MaxBeatInput: number
    BeatsStepSize: number
    MinStrokePeriod: number
    MaxStrokePeriod: number
    MinStopPeriod: number
    MaxStopPeriod: number
}
type Func_SettingPropsRegistry = (props: SettingProps)=>void

export const CtxSettingProps = React.createContext({
    registry: ( cb: Func_SettingPropsRegistry ) => {},
    setSettingProps: (props: SettingProps) => {},
    getSettingProps: (): SettingProps|void => {  },
});

export const BaseSettingProps = {
    OrgamsTimes: 2,
    PreferOrgasmPeriod: 20,
    EdgeTimes: 5,
    RelexPeriod : 3,
    PostOrgasmTortureMinPeriod: 20,
    PostOrgasmTortureMaxPeriod: 40,
    MinBeatInput: 15,
    MaxBeatInput: 120,
    BeatsStepSize: 1,
    MinStrokePeriod: 6,
    MaxStrokePeriod: 15,
    MinStopPeriod: 20,
    MaxStopPeriod: 40,
}

const VSettingPropsContext = (props: {children: JSX.Element })=>{
    let settingPropsRef = useRef<SettingProps>(BaseSettingProps) 
    let registryRef = useRef<((props: SettingProps)=>void)[]>([])
    let registry = useCallback((cb: Func_SettingPropsRegistry)=>{
        registryRef.current.push(cb)
    },[registryRef])
    let setSettingProps = useCallback((tag: SettingProps)=>{
        registryRef.current.forEach(cb=>{
            cb(tag)
        })
        settingPropsRef.current = tag
    },[settingPropsRef,registryRef])
    let getSettingProps = useCallback(():SettingProps=>{
        return settingPropsRef.current
    },[])
    return <>
        <CtxSettingProps.Provider value={{registry,setSettingProps,getSettingProps}}>
            {props.children}
        </CtxSettingProps.Provider>
    </>
}
export default VSettingPropsContext