import { RunningStatus, ctxRunningStatusStore } from "@/store/StatusStore"
import { BeatState, StrokeAction } from "./BeatFactory"

import styles from "./CCacheList.module.css"
import { StrokeActionLabelMap } from "./CDashboard"
import { useCallback, useContext, useEffect, useRef } from "react"
import { CtxSettingProps, SettingProps } from "@/store/SettingProp"

const ColorLevel = 4

const CCacheList = (props:{cacheBeat : BeatState[]})=>{
    let ctxSettingProps  = useContext(CtxSettingProps)
    let stepRef = useRef<number>(0)
    let startRef = useRef<number>(0)

    useEffect(()=>{
        let changeStep = (_props: SettingProps)=>{
            let max = _props.MaxBeatInput
            let min = _props.MinBeatInput
            stepRef.current = Math.abs(max-min)/ColorLevel
            console.warn("stepRef.current",stepRef.current)
            startRef.current = _props.MinBeatInput
        }
        ctxSettingProps.registry(changeStep)
        let currentProps = ctxSettingProps.getSettingProps()
        if(currentProps != null){
            changeStep(currentProps)
        }
    },[ctxSettingProps])


    let GetSpeedLevel = useCallback((beat: number)=>{
        for(let i=0;i<ColorLevel;i++){
            let threshold = startRef.current + (i+1)*stepRef.current
            if( beat < threshold){
                return `speed${i+1}-beat`
            }
        }
        return `speed${ColorLevel}-beat`
    },[startRef,stepRef])

    

    return <>
    <div className={`${styles["list"]}`}>
        <div>
            <label>Beat</label>
        </div>
        <div>
            <label>Action</label>
        </div>
        <div>
            <label>Period</label>
        </div>
    </div>
    <div className={`${styles["list-body"]}`}>
        {props.cacheBeat.map((v,i)=>{
            return <CCacheItem key={"cacheItem-"+i} speedLevel={GetSpeedLevel(v.beat)} state={v} />
        })}
    </div>
    </>
}

const CCacheItem = (props: {state: BeatState, speedLevel: string}) =>{

    return <div className={`${styles["list"]}`}>
        <div>
            <div className={`${styles[props.speedLevel]}`}>{props.state.beat}</div>
        </div>
        <div>
            <div>{StrokeActionLabelMap[props.state.action]}</div>
        </div>
        <div>
            <div>{props.state.period}</div>
        </div>
    </div>
}

export default CCacheList