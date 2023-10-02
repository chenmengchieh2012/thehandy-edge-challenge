'use client'

import { API__CheckHandyConnect } from "@/api/handy"
import { CtxHandyKeyStore } from "@/store/HandyKey"
import { CtxSettingProps, SettingProps } from "@/store/SettingProp"
import { useContext, useDeferredValue, useEffect, useState } from "react"
import { IoCheckmarkCircleOutline, IoCloseCircleOutline } from "react-icons/io5"

const CInfo = ()=>{
    const ctxSettingProps = useContext(CtxSettingProps)
    const ctxHandyKey = useContext(CtxHandyKeyStore)
    let [ handyKey ,setHandyKey] = useState<string>("")
    let deferHandyKey = useDeferredValue(handyKey)
    let [ settingInfo ,setSettingProps] = useState<SettingProps|undefined>(undefined)

    let [ handyConnectResult, setHandyConnectResult ] = useState<boolean>(false)

    useEffect(()=>{
        if(deferHandyKey != ""){
            API__CheckHandyConnect(deferHandyKey)
                .then(isConnect=>{
                    setHandyConnectResult(isConnect)
                })
        }
    },[deferHandyKey])


    useEffect(()=>{
        ctxSettingProps.registry((props)=>{
            setSettingProps(props)
        })
        ctxHandyKey.registry((key)=>{
            setHandyKey(key)
        })
        let _settingProp = ctxSettingProps.getSettingProps() 
        if ( _settingProp != undefined ) {
            setSettingProps(_settingProp)
        }
    },[ctxSettingProps])

    return <>
        <div style={{color:'gray',fontSize:'0.8rem'}}>
            <div>HandyKey: {handyKey} 
            <span style={{verticalAlign:"middle"}}>
                {handyConnectResult && <IoCheckmarkCircleOutline color={"green"} />}
                {!handyConnectResult && <IoCloseCircleOutline color={"red"}/>}
            </span>
            </div>
        </div>
        <div style={{color:'gray',fontSize:'0.8rem'}}>
            {settingInfo != undefined && Object.keys(settingInfo).map( (key )  => {
                return <p key={"cinfo"+key}>{key}:{settingInfo != undefined && settingInfo[key as keyof SettingProps]}</p>
            })}
        </div>
    </>
}

export default CInfo