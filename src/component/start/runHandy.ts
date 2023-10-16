import { useContext, useDeferredValue, useEffect, useState } from "react";
import { BeatState } from "./BeatFactory";
import { API__GetHandyState, API__SetHandySlide, API__SetHandyStartStroke, API__SetHandyStopStroke, API__SetHandyVelocity } from "@/api/handy";
import { CtxHandyKeyStore } from "@/store/HandyKey";
import { CtxSettingProps } from "@/store/SettingProp";

enum PositionMod {
    Normal, Head, Bottom
}


export interface fRunHandy {
    setPosition: (min: number, max: number)=>void
    position: {min: number,max: number}
}

const RunHandy = (currentBeat: BeatState|null): fRunHandy=>{
    const ctxHandyKey = useContext(CtxHandyKeyStore)
    const ctxSettingProps  = useContext(CtxSettingProps)
    const [position, _setPosition] = useState<{min: number,max: number}>({min:0,max:100})
    const deferPosition = useDeferredValue(position)
    const [handyKey ,setHandyKey ] = useState<string>("")
    useEffect(()=>{
        ctxHandyKey.registry((handyKey)=>{
            setHandyKey(handyKey)
        })
    },[ctxHandyKey])
    useEffect(()=>{
        console.log("runHandyts ",currentBeat)
        let settingProps = ctxSettingProps.getSettingProps()
        if(settingProps == null){
            return 
        }
        if(handyKey == ""){
            return
        }
        if( currentBeat == null || currentBeat.beat == 0 ){
            API__SetHandyStopStroke(handyKey)
            .then((successed)=>{
                console.log(" run handy")
            })
        }else if( currentBeat.beat > 0){
            let percentage = Math.trunc(100*(currentBeat.beat/settingProps.MaxBeatInput))
            API__GetHandyState(handyKey)
            .then((successed)=>{
                console.log("success: ",successed)
                if(!successed){
                    return API__SetHandyStartStroke(handyKey)
                }else{
                    return true
                }
            })
            .then((successed)=>{
                if(successed){
                    return API__SetHandyVelocity(handyKey,percentage)
                }
            })
            .then((successed)=>{
                console.log(" run handy")
            })
        }
    },[handyKey, ctxSettingProps, currentBeat])
    useEffect(()=>{
        let settingProps = ctxSettingProps.getSettingProps()
        API__SetHandySlide(handyKey,deferPosition.max, deferPosition.min)
        .then((successed)=>{
            console.log(" run handy")
        })
    },[handyKey, ctxSettingProps, deferPosition])
    return {
        setPosition: (min: number,max: number)=>{
            _setPosition({min,max})
        },
        position: position
    }
}

export default RunHandy