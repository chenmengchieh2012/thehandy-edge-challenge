import { useCallback, useEffect, useRef, useState } from "react"
import { BeatState, StrokeAction } from "./BeatFactory"
import styles from "./CDashboard.module.css"
import { ExecState } from "./timeRuner"
import { PeriodSpeed } from "../utils"
import { RunningStatus } from "@/store/StatusStore"
import { FCLog } from "./CLog"

export var StrokeActionLabelMap:{[key:number]:string} = {
    [StrokeAction.NotStroke]: "Off",
    [StrokeAction.Stroke]: "On",
    [StrokeAction.Edge]: "Edge",
    [StrokeAction.Torture]: "Torture",
    [StrokeAction.Relex]: "Relex",
}

const CDashBoard = (props:{
    execState: ExecState, 
    currentBeat: BeatState|null, 
    runningStatus: RunningStatus,
    fCLog: React.RefObject<FCLog>
})=>{

    const [ remainTime, setRemainTime ] = useState(0)
    const lastCurrentBeatRef = useRef<BeatState|null>(null)


    useEffect(()=>{
        if(lastCurrentBeatRef.current != props.currentBeat  && lastCurrentBeatRef.current && props.fCLog.current != null){
            props.fCLog.current.addLog(remainTime,lastCurrentBeatRef.current)
        }
        lastCurrentBeatRef.current = props.currentBeat
    },[props.currentBeat, props.fCLog, remainTime])



    useEffect(()=>{
        let interval = setInterval(()=>{
            if(props.execState != ExecState.Pause){
                setRemainTime(i=> i-1 < 0 ? 0 : i-1 )
            }
        },PeriodSpeed)
        return ()=>{
            clearInterval(interval)
        }
    },[props.execState])
    useEffect(()=>{
        if( props.currentBeat == null){
            return
        }
        setRemainTime(props.currentBeat.period)   
    },[props.currentBeat])
    useEffect(()=>{
        if( props.execState == ExecState.Stop){ 
            setRemainTime(0)   
        }
    },[props.execState])

    let timeAdaptor = useCallback((startTime : number): string=>{
        if(startTime == 0) {
            return `${String(0).padStart(2, "0")}:${String(0).padStart(2, "0")}`
        }
        let totalsecond = Math.ceil((new Date().getTime() - startTime) / 1000)
        let totalMinute = Math.trunc(totalsecond / 60 )
        let innerSecond = totalsecond % 60
        return `${String(totalMinute).padStart(2, "0")}:${String(innerSecond).padStart(2, "0")}`
    },[])

    return <>
    <div className={`${styles["beatblock"]}`}>
        <label>beat</label>
        <div>{props.currentBeat?.beat}</div>
    </div>
    <div className={`${styles["beatblock"]}`}>
        <label>動作</label>
        <div>
            {props.currentBeat != undefined && StrokeActionLabelMap[props.currentBeat.action]}
        </div>
    </div>
    <div className={`${styles["beatblock"]}`}>
        <label>秒數</label>
        <div>{remainTime}<div className={`${styles["period"]}`}>/{props.currentBeat?.period}</div></div>
    </div>
    <div className={`${styles["beatblock"]}`}>
        <label>狀態</label>
        <div>
            {props.execState == ExecState.Pause  && "Pause"}
            {props.execState == ExecState.Stop  && "Stop"}
            {props.execState == ExecState.Run && "Start"}
        </div>
    </div>
    <div className={`${styles["beatblock"]}`}>
        <label>總時間</label>
        <div>{timeAdaptor(props.runningStatus.startTime)}</div>
    </div>
    <div className={`${styles["beatblock"]}`}>
        <label>Edges</label>
        <div>{props.runningStatus.currentEdgeTimes}</div>
    </div>
    <div className={`${styles["beatblock"]}`}>
        <label>Orgams</label>
        <div>{props.runningStatus.currentOrgasm}</div>
    </div>
    
    </>
}

export default CDashBoard