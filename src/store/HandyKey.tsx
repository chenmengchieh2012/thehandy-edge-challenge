'use client'

import React, { useCallback, useRef } from "react";

type Func_HandyKeyRegistry = (handyKey: string)=>void

export const CtxHandyKeyStore = React.createContext({
    registry: ( cb: Func_HandyKeyRegistry ) => {},
    setHandyKey: (handyKey: string) => {},
    getHandyKey: ():string => {return "" },
});

const VHandyKeyContext = (props: {children: JSX.Element })=>{
    let handyKeyRef = useRef<string>("") 
    let registryRef = useRef<((tag: string)=>void)[]>([])
    let registry = useCallback((cb: Func_HandyKeyRegistry)=>{
        registryRef.current.push(cb)
    },[])
    let setHandyKey = useCallback((tag: string)=>{
        registryRef.current.forEach(cb=>{
            cb(tag)
        })
        handyKeyRef.current = tag
    },[])
    let getHandyKey = useCallback(():string=>{
        return handyKeyRef.current
    },[])
    return <>
        <CtxHandyKeyStore.Provider value={{registry,setHandyKey,getHandyKey}}>
            {props.children}
        </CtxHandyKeyStore.Provider>
    </>
}
export default VHandyKeyContext