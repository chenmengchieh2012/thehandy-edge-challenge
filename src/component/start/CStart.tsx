'use client'
import { useCallback, useContext, useEffect, useRef, useState } from "react"
import styles from "./CStart.module.css"
import CButton from "../CButton"
import CInput from "../CInput"
import { BaseSettingProps, CtxSettingProps, SettingProps } from "@/store/SettingProp"
import useBeat, { BeatState, StrokeAction } from "./useBeat"

const CStart = ()=>{
    let ctx  = useContext(CtxSettingProps)
    let [settingProps,setSettingProps] = useState<SettingProps>(BaseSettingProps)
    useEffect(()=>{
        ctx.registry(_props=>{
            setSettingProps(_props)
        })
    },[])
    const [beatState, beatAction] = useBeat(settingProps)
    let song = new Audio("tick-tak.mp3");

    const EdgeLevelRangeInputRef = useRef<HTMLInputElement>(null)

    
    useEffect(()=>{
        console.log("beatState",beatState)
    },[beatState])

    useEffect(()=>{
        let interval = setInterval(()=>{
            if(beatState.action == StrokeAction.Stroke || beatState.action == StrokeAction.Torture ){
                song.muted = false
                console.log("interval",song.muted)
                song.pause();
                song.volume = 1
                song.currentTime = 0;
                song.play()
            }else{
                song.muted = true
                song.pause();
            }
        },2000*(30/beatState.beat))
        return ()=>{
            song.currentTime = 0;
            console.log("clearInterval",song.muted)
            clearInterval(interval)
        }
    },[beatState,song])

    let doChangeEdgeLevel = useCallback(()=>{
        if( EdgeLevelRangeInputRef.current != undefined){
            beatAction.setEdgeLevel(Number(EdgeLevelRangeInputRef.current.value))
        }
    },[song,EdgeLevelRangeInputRef,beatAction])

    return <>
        <div>
            <div className={`${styles["container"]}`}>
                <div className={`${styles["row"]}`}>
                    <div className={`${styles["beatblock"]}`}>
                        <label>beat</label>
                        <div>{beatState.beat}</div>
                    </div>
                    <div className={`${styles["beatblock"]}`}>
                        <label>狀態</label>
                        <div>{beatState.action == StrokeAction.NotStroke && "手停下"}</div>
                        <div>{beatState.action == StrokeAction.Stroke && "繼續"}</div>
                        <div>{beatState.action == StrokeAction.Pause && "站停"}</div>
                        <div>{beatState.action == StrokeAction.Stop && "停止"}</div>
                        <div>{beatState.action == StrokeAction.Torture && "強迫"}</div>
                        <div>{beatState.action == StrokeAction.Relex && "休息"}</div>
                    </div>
                </div>
                <CButton onClick={(e) => { beatAction.Start() } } label={"開始"}/>
                {(beatState.action == StrokeAction.Stroke  || beatState.action == StrokeAction.NotStroke )&& <CButton onClick={(e) => { beatAction.Pause() } } label={"暫停"}/>}
                {(beatState.action == StrokeAction.Pause ) && <CButton onClick={(e) => {  beatAction.Resume() } } label={"繼續"}/>}
                <CButton onClick={(e) => { beatAction.Stop() } } label={"結束"}/>
                <CInput type="range" max={8} min={1} onChange={e=>{
                    doChangeEdgeLevel();
                }}inputRef={EdgeLevelRangeInputRef} label={"EdgeLevel"} ></CInput>
                <CButton onClick={e=>{
                    beatAction.setEdge();
                    if (EdgeLevelRangeInputRef.current) {
                        EdgeLevelRangeInputRef.current.value = "100"
                    }
                }} label={"Edge"} ></CButton>
                <CButton onClick={e=>{beatAction.setOrgams()}} label={"Orgams"} ></CButton>
            </div>
            <div>
                {beatState != undefined && Object.keys(beatState).map( (key )  => {
                    return <p>{key}:{beatState != undefined && beatState[key as keyof BeatState]}</p>
                })}
            </div>
        </div>
    
    </>
}

export default CStart