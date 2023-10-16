'use client'

import { API__CheckHandyConnect, API__SetHandyStrokeMode } from "@/api/handy"
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
        const loopForConnectCheck = ()=>{
            if(deferHandyKey == ""){
                return 
            }
            API__CheckHandyConnect(deferHandyKey)
                .then(isConnect=>{
                    if(isConnect && handyConnectResult == false){
                        setHandyConnectResult(isConnect)
                        return API__SetHandyStrokeMode(deferHandyKey)
                    }else if(!isConnect && handyConnectResult == true){
                        setHandyConnectResult(isConnect)
                        throw new Error("not connect")
                    }else{
                        throw new Error("not connect")
                    }
                })
                .then(()=>{
                    if(handyConnectResult == false){
                        console.log("set mode OK")
                    }
                })
                .catch(e=>{
                    console.log("not connected")
                })
        }
        if(deferHandyKey != "" && handyConnectResult == false){
            let interval = setInterval(loopForConnectCheck,2000)
            return ()=>{
                clearInterval(interval)
            }
        }
    },[deferHandyKey, handyConnectResult])


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