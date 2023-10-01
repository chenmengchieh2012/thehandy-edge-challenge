'use client'
import React, { useCallback, useContext, useEffect, useRef, useState } from "react"
import styles from "./CStart.module.css"
import CButton, { ButtonMode } from "../CButton"
import CInput from "../CInput"
import { BaseSettingProps, CtxSettingProps, SettingProps } from "@/store/SettingProp"
import { BeatState, StrokeAction } from "./BeatFactory"
import { BaseRunningStatusProps, RunningStatus, ctxRunningStatusStore } from "@/store/StatusStore"
import TimeRuner, { ExecState } from "./timeRuner"
import StatusDecorator from "./statusDecorator"
import { IoPauseOutline, IoPlayForwardOutline, IoPlayOutline, IoRocketOutline, IoStopOutline, IoVolumeHighOutline, IoVolumeMuteOutline } from "react-icons/io5"
import CDashBoard from "./CDashboard"
import CCacheList from "./CCacheList"
import CLog, { FCLog } from "./CLog"


const CStart = ()=>{
    let ctxSettingProps  = useContext(CtxSettingProps)
    let ctxRunningStatus  = useContext(ctxRunningStatusStore)
    let intervalRef = useRef<NodeJS.Timeout>()
    let cLogRef = useRef<FCLog>(null)

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
        let audio = new Audio()
        audio.src = "tick-tak.mp3"
        audio.autoplay = true;
        audio.load()
        setTicktakSource(audio)
    },[])
    const [execState, currentBeat, cacheBeat, timeRunerAction] = TimeRuner(settingProps,runningStatusProps)
    const statusAction = StatusDecorator(ctxRunningStatus)

    const EdgeLevelRangeInputRef = useRef<HTMLInputElement>(null)

    let [ forceMute, setForceMute ] = useState<boolean>(false)



   
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
            if( ticktakSource == null ){
                return
            }
            if( currentBeat?.action == StrokeAction.Stroke || currentBeat?.action == StrokeAction.Torture ){
                
                ticktakSource.src = "data:audio/mpeg;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAAA1N3aXRjaCBQbHVzIMKpIE5DSCBTb2Z0d2FyZQBUSVQyAAAABgAAAzIyMzUAVFNTRQAAAA8AAANMYXZmNTcuODMuMTAwAAAAAAAAAAAAAAD/80DEAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsRbAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQMSkAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV";
                ticktakSource.src = "tick-tak.mp3";
                ticktakSource.muted = forceMute ? true : false
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
    },[currentBeat, execState, ticktakSource,forceMute])

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


    let doForceMute = useCallback((e: React.MouseEvent<HTMLButtonElement>)=>{
        setForceMute(b=>!b)
    },[])

    return <>
        <div>
            <div className={`${styles["container"]}`}>
                <div className={`${styles["row"]}`}>
                    <CDashBoard fCLog={cLogRef} execState={execState} currentBeat={currentBeat} runningStatus={runningStatusProps} ></CDashBoard>
                </div>
                <div className={`${styles["row"]}`}>
                    <div className={`${styles["status-btns"]}`}>
                        <CButton mode={ButtonMode.Success} onClick={doEdge} label={"Edge"} ></CButton>
                        <CButton mode={ButtonMode.Alert} onClick={doOrgams} label={"Orgams"} ></CButton>
                    </div>
                </div>
                <div className={`${styles["row"]}`}>
                    <div className={`${styles["running-btns"]}`}>
                        <CButton onClick={doForceMute} label={
                            forceMute ? <IoVolumeMuteOutline/> : <IoVolumeHighOutline/> 
                        } ></CButton>
                        <CButton onClick={doRun} label={<IoPlayOutline/>}/>
                        <CButton onClick={doPause} disabled={execState != ExecState.Run} label={<IoPauseOutline/>}/>
                        <CButton onClick={doResume} disabled={execState != ExecState.Pause}  label={<IoPlayForwardOutline/>}/>
                        <CButton onClick={doStop} label={<IoStopOutline/>}/>
                    </div>
                </div>
                <div className={`${styles["row"]}`}>
                    <CInput 
                        className={`${styles["edge-level"]}`} type="range" 
                        max={8} min={1} onChange={doChangeEdgeLevel} 
                        inputRef={EdgeLevelRangeInputRef} 
                        label={<IoRocketOutline/>} >
                    </CInput>
                </div>
            </div>
            <div className={`${styles["body"]}`}>
                <div className={`${styles["left"]}`}> 
                    <div className={`${styles["left-label"]}`}>Next: </div>
                    <CCacheList cacheBeat={cacheBeat} ></CCacheList>
                </div>
                <div className={`${styles["right"]}`}> 
                    <div className={`${styles["right-label"]}`}>History: </div>
                    <CLog ref={cLogRef}></CLog>
                </div>
            </div>
        </div>
    
    </>
}

export default CStart