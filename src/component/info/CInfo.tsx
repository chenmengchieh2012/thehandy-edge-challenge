'use client'

import { CtxSettingProps, SettingProps } from "@/store/SettingProp"
import { useContext, useEffect, useState } from "react"

const CInfo = ()=>{
    const ctxSettingProps = useContext(CtxSettingProps)
    let [ settingInfo ,setSettingProps] = useState<SettingProps|undefined>(undefined)

    useEffect(()=>{
        ctxSettingProps.registry((props)=>{
            setSettingProps(props)
        })
        let _settingProp = ctxSettingProps.getSettingProps() 
        if ( _settingProp != undefined ) {
            setSettingProps(_settingProp)
        }
    },[ctxSettingProps])

    return <>
        <div style={{color:'gray',fontSize:'0.8rem'}}>
            {settingInfo != undefined && Object.keys(settingInfo).map( (key )  => {
                return <p key={"cinfo"+key}>{key}:{settingInfo != undefined && settingInfo[key as keyof SettingProps]}</p>
            })}
        </div>
    </>
}

export default CInfo