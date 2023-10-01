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
        // audio.src = "data:audio/mpeg;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAAA1N3aXRjaCBQbHVzIMKpIE5DSCBTb2Z0d2FyZQBUSVQyAAAABgAAAzIyMzUAVFNTRQAAAA8AAANMYXZmNTcuODMuMTAwAAAAAAAAAAAAAAD/80DEAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsRbAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQMSkAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV";
        audio.src = "data:audio/mpeg;base64,//uQBAAAAowp0KUh4ABUJApaozAAjWjVgblagBGsm3Q3K1QCEcYAAH8y/HLi7kAoAABAAmJoOBwY1fOwKyChjJK/hJwtiELseguDpjZ7MDJKhigea//zTV77xSnpSmvm970pT3fv4+H78P5QMawQd/D8ocKBi6AAAAAAKL3s0R3jH1iAAQBwICJEvX4cHmmB5t8OBILEINCZE2/ixZqxZSZvMzMzO3v9F58EC7wfPlAQdEAILBBYPvEYf/lHUwf/wfB8HwfBwEAQdQOBwOBwOBwOBwMBQAAtPzIQB8DKbPA4uqyNHMRFhA1UAgCQonXBEGQCAKA4QfgAicDJAtAx6AQAQKur4Y6OQOsLQQuq/8arkIRQEgABIG//hvQBwLGSHgcAYvAOBf/+Os2RMTdROAz/zp8/gOBwOBwOBwOBwMBAAA5/yoHS+BlVygc3Xq9gNRA0DEYY8AoUgYMEoGCxB+CEVgZOKYGbxCGz/4YrECBdWGRQFAP/4NoAMB4PhD9As0BggPf/gMCQXyQ5Ib6PgVp//iUCfY0L5mQMmyl/yhtM//uSBAAAAvRZ2tY0oAZfCtt9xRQAypitABy0gAlYn+CHkoAA8IAAokbCYcEglGoTTUl2SQxCBLmT4SF75w4KGQS6Ah3N/KcfCOVDfO2UizG/5nYazmlLX/ZpEZyUMbRSl/5z2VyEyOpTGNMJKX/4IBxdxMPi4EaHA4KC6VKIo+EdlFlBQAAATBQcDgbEglGoqRCt2ObCgAvOfEh/yENN5TTW+JuiqpSmN9yUMhkMYrfio85DquUv/kOchCOQhjGzKVf+c9lcjZJSoYyGMrf/FAOeJh8XDjOHA4KC9opL4R2UXa1tf7TVsGx4pA6AiaEIImVkS4CgBFVoULNIhUGmVkTW3FWNoULPlaFDqFCzWqhUEXkIZcsiXAUAIamhQs0sKhU5YVIpRTcTfxF//QV4r4R0L+BTA1AJIkWxikFgSZWRSuOUsSq18iorYqK1DSHICpxINQ9qBYWFqZm1rhVrZtVZtVWA6BsKoULC1kg1AVOJFRVYYo6mZv/lV4uSRW1WouSRW5XhtRVuV87yqYgpqKBgASEAAIAAAAAAAAAAAAAAAA==";
        audio.autoplay = true;
        // audio.load()
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
            console.log("play")
            if( ticktakSource == null ){
                return
            }
            if( currentBeat?.action == StrokeAction.Stroke || currentBeat?.action == StrokeAction.Torture ){
                // ticktakSource.src = "data:audio/mpeg;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAAA1N3aXRjaCBQbHVzIMKpIE5DSCBTb2Z0d2FyZQBUSVQyAAAABgAAAzIyMzUAVFNTRQAAAA8AAANMYXZmNTcuODMuMTAwAAAAAAAAAAAAAAD/80DEAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsRbAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQMSkAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV";
                // ticktakSource.src = "data:audio/mpeg;base64,//uQBAAAAowp0KUh4ABUJApaozAAjWjVgblagBGsm3Q3K1QCEcYAAH8y/HLi7kAoAABAAmJoOBwY1fOwKyChjJK/hJwtiELseguDpjZ7MDJKhigea//zTV77xSnpSmvm970pT3fv4+H78P5QMawQd/D8ocKBi6AAAAAAKL3s0R3jH1iAAQBwICJEvX4cHmmB5t8OBILEINCZE2/ixZqxZSZvMzMzO3v9F58EC7wfPlAQdEAILBBYPvEYf/lHUwf/wfB8HwfBwEAQdQOBwOBwOBwOBwMBQAAtPzIQB8DKbPA4uqyNHMRFhA1UAgCQonXBEGQCAKA4QfgAicDJAtAx6AQAQKur4Y6OQOsLQQuq/8arkIRQEgABIG//hvQBwLGSHgcAYvAOBf/+Os2RMTdROAz/zp8/gOBwOBwOBwOBwMBAAA5/yoHS+BlVygc3Xq9gNRA0DEYY8AoUgYMEoGCxB+CEVgZOKYGbxCGz/4YrECBdWGRQFAP/4NoAMB4PhD9As0BggPf/gMCQXyQ5Ib6PgVp//iUCfY0L5mQMmyl/yhtM//uSBAAAAvRZ2tY0oAZfCtt9xRQAypitABy0gAlYn+CHkoAA8IAAokbCYcEglGoTTUl2SQxCBLmT4SF75w4KGQS6Ah3N/KcfCOVDfO2UizG/5nYazmlLX/ZpEZyUMbRSl/5z2VyEyOpTGNMJKX/4IBxdxMPi4EaHA4KC6VKIo+EdlFlBQAAATBQcDgbEglGoqRCt2ObCgAvOfEh/yENN5TTW+JuiqpSmN9yUMhkMYrfio85DquUv/kOchCOQhjGzKVf+c9lcjZJSoYyGMrf/FAOeJh8XDjOHA4KC9opL4R2UXa1tf7TVsGx4pA6AiaEIImVkS4CgBFVoULNIhUGmVkTW3FWNoULPlaFDqFCzWqhUEXkIZcsiXAUAIamhQs0sKhU5YVIpRTcTfxF//QV4r4R0L+BTA1AJIkWxikFgSZWRSuOUsSq18iorYqK1DSHICpxINQ9qBYWFqZm1rhVrZtVZtVWA6BsKoULC1kg1AVOJFRVYYo6mZv/lV4uSRW1WouSRW5XhtRVuV87yqYgpqKBgASEAAIAAAAAAAAAAAAAAAA==";
                // ticktakSource.load()
                ticktakSource.muted = true
                ticktakSource.play()
                ticktakSource.muted = false
                ticktakSource.muted = forceMute ? true : false
                // ticktakSource.pause();
                ticktakSource.volume = 1
                ticktakSource.currentTime = 0;
                ticktakSource.play()
            }else{
                ticktakSource.muted = true
                ticktakSource.pause();
            }
        },1000*(60/currentBeat.beat))
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