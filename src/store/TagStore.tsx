'use client'

import React, { useCallback, useRef } from "react";

type TagName = string
export const TagName__Setting:TagName= "Setting"
export const TagName__Starting:TagName= "Start"
export const TagName__Nil:TagName= ""
type Func_TagRegistry = (activeTag: string)=>void

export const ctxTagStore = React.createContext({
    registry: ( cb: Func_TagRegistry ) => {},
    setActiveTag: (tag: string) => {},
    getActiveTag: ():TagName => {return TagName__Nil },
});

const VTagContext = (props: {children: JSX.Element })=>{
    let activeTagRef = useRef<TagName>(TagName__Nil) 
    let registryRef = useRef<((tag: string)=>void)[]>([])
    let registry = useCallback((cb: Func_TagRegistry)=>{
        registryRef.current.push(cb)
    },[])
    let setActiveTag = useCallback((tag: string)=>{
        registryRef.current.forEach(cb=>{
            cb(tag)
        })
        activeTagRef.current = tag
    },[])
    let getActiveTag = useCallback(():TagName=>{
        return activeTagRef.current
    },[])
    return <>
        <ctxTagStore.Provider value={{registry,setActiveTag,getActiveTag}}>
            {props.children}
        </ctxTagStore.Provider>
    </>
}
export default VTagContext