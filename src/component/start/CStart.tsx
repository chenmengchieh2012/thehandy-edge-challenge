'use client'
import React, { useCallback, useContext, useEffect, useRef, useState } from "react"
import styles from "./CStart.module.css"
import CButton from "../CButton"
import CInput from "../CInput"
import { BaseSettingProps, CtxSettingProps, SettingProps } from "@/store/SettingProp"
import useBeat, { BeatState, StrokeAction } from "./BeatFactory"
import { BaseRunningStatusProps, RunningStatus, ctxRunningStatusStore } from "@/store/StatusStore"
import TimeRuner, { ExecState } from "./timeRuner"
import StatusDecorator from "./statusDecorator"


const CStart = ()=>{
    let ctxSettingProps  = useContext(CtxSettingProps)
    let ctxRunningStatus  = useContext(ctxRunningStatusStore)
    let intervalRef = useRef<NodeJS.Timeout>()

    let [settingProps,setSettingProps] = useState<SettingProps>(BaseSettingProps)
    let [ticktakSource, setTicktakSource] = useState<HTMLAudioElement|null>(null)
    let [runningStatusProps,setRunningStatusProps] = useState<RunningStatus>(BaseRunningStatusProps)
    useEffect(()=>{
        ctxSettingProps.registry(_props=>{
            setSettingProps(_props)
        })
        ctxRunningStatus.registry(_props=>{
            setRunningStatusProps(_props)
        })
    },[ctxSettingProps,ctxRunningStatus])

    useEffect(()=>{
        setTicktakSource(new Audio("tick-tak.mp3"))
    },[])
    const [execState, currentBeat, cacheBeat, timeRunerAction] = TimeRuner(settingProps,runningStatusProps)
    const statusAction = StatusDecorator(ctxRunningStatus)

    const EdgeLevelRangeInputRef = useRef<HTMLInputElement>(null)

   
    useEffect(()=>{
        const reset = ()=>{
            if(ticktakSource != null){
                ticktakSource.currentTime = 10;
            }
            console.log("clearInterval")
            clearInterval(intervalRef.current)
        }
        reset()
        if(currentBeat == null){
            return reset
        }

        if(execState == ExecState.Stop || execState == ExecState.Pause){
            return reset
        } 
        let interval = setInterval(()=>{
            if(ticktakSource == null){
                return
            }
            if(currentBeat?.action == StrokeAction.Stroke || currentBeat?.action == StrokeAction.Torture ){
                ticktakSource.muted = false
                ticktakSource.pause();
                ticktakSource.volume = 1
                ticktakSource.currentTime = 0;
                ticktakSource.play()
            }else{
                ticktakSource.muted = true
                ticktakSource.pause();
            }
        },2000*(30/currentBeat.beat))
        intervalRef.current = interval
        return reset
    },[currentBeat, execState, ticktakSource])

    let doChangeEdgeLevel = useCallback((e: React.ChangeEvent<HTMLInputElement>)=>{
        if( EdgeLevelRangeInputRef.current != undefined){
            statusAction.setEdgeLevel(Number(EdgeLevelRangeInputRef.current.value))
        }
    },[statusAction])


    let doEdge = useCallback((e: React.MouseEvent<HTMLButtonElement>)=>{
        statusAction.addEdge()
        timeRunerAction.Edge()
        if (EdgeLevelRangeInputRef.current) {
            EdgeLevelRangeInputRef.current.value = "100"
        }
    },[statusAction, timeRunerAction])


    let doOrgams = useCallback((e: React.MouseEvent<HTMLButtonElement>)=>{
        statusAction.addOrgams()
        timeRunerAction.Orgams()
        if (EdgeLevelRangeInputRef.current) {
            EdgeLevelRangeInputRef.current.value = "0"
        }
    },[statusAction, timeRunerAction])

    let doRun = useCallback((e: React.MouseEvent<HTMLButtonElement>)=>{
        statusAction.start()
        timeRunerAction.Start()
    },[statusAction, timeRunerAction])

    let doPause = useCallback((e: React.MouseEvent<HTMLButtonElement>)=>{
        timeRunerAction.Pause()
    },[timeRunerAction])


    let doResume = useCallback((e: React.MouseEvent<HTMLButtonElement>)=>{
        timeRunerAction.Resume()
    },[timeRunerAction])


    let doStop = useCallback((e: React.MouseEvent<HTMLButtonElement>)=>{
        timeRunerAction.Stop()
        statusAction.stop()
    },[statusAction, timeRunerAction])

    return <>
        <div>
            <div className={`${styles["container"]}`}>
                <div className={`${styles["row"]}`}>
                    <div className={`${styles["beatblock"]}`}>
                        <label>beat</label>
                        <div>{currentBeat?.beat}</div>
                    </div>
                    <div className={`${styles["beatblock"]}`}>
                        <label>動作</label>
                        <div>{currentBeat?.action == StrokeAction.NotStroke && "手停下"}</div>
                        <div>{currentBeat?.action == StrokeAction.Stroke && "繼續"}</div>
                        <div>{currentBeat?.action == StrokeAction.Torture && "強迫"}</div>
                        <div>{currentBeat?.action == StrokeAction.Relex && "休息"}</div>
                    </div>
                    <div className={`${styles["beatblock"]}`}>
                        <label>狀態</label>
                        <div>{execState == ExecState.Pause && "暫停"}</div>
                        <div>{execState == ExecState.Stop && "停止"}</div>
                        <div>{execState == ExecState.Run && "運作"}</div>
                    </div>
                </div>
                <CButton onClick={doRun} label={"開始"}/>
                <CButton onClick={doPause} disabled={execState != ExecState.Run} label={"暫停"}/>
                <CButton onClick={doResume} disabled={execState != ExecState.Pause}  label={"繼續"}/>
                <CButton onClick={doStop} label={"結束"}/>
                <CInput type="range" max={8} min={1} onChange={doChangeEdgeLevel} inputRef={EdgeLevelRangeInputRef} label={"EdgeLevel"} ></CInput>
                <CButton onClick={doEdge} label={"Edge"} ></CButton>
                <CButton onClick={doOrgams} label={"Orgams"} ></CButton>
            </div>
            <div>
                {currentBeat != undefined && Object.keys(currentBeat).map( (key,i )  => {
                    return <p key={"beatStatus-"+key}>
                            {key}:{currentBeat != undefined && currentBeat[key as keyof BeatState]}
                        </p>
                })}
            </div>
            <div>
                {JSON.stringify(cacheBeat)}
            </div>
            <div>
                {JSON.stringify(runningStatusProps)}
            </div>
        </div>
    
    </>
}

export default CStart