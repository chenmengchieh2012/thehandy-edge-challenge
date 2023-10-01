import { SettingProps } from "@/store/SettingProp"
import { RunningStatus } from "@/store/StatusStore"
import React, { useCallback, useEffect, useRef, useState } from "react"
import BeatFactory, { BeatMode, BeatState, StrokeAction } from "./BeatFactory"
import { PeriodSpeed } from "../utils"
import { FCLog } from "./CLog"

export enum ExecState {
    Run, Stop, Pause
}

interface TimeRunerAction {
    Start: ()=>void
    Stop: ()=>void
    Pause: ()=>void
    Resume: ()=>void
    Orgams: ()=>void
    Edge: ()=>void
}

let CATCH_SIZE = 5

const TimeRuner = (
        ctx: SettingProps, 
        status: RunningStatus
    ):[ ExecState , BeatState|null, BeatState[], TimeRunerAction] =>{
    let pauseBeatRef = useRef<BeatState|null>()
    let lastTimeRef = useRef<number>(0)
    let [ execState, setExecState ] = useState(ExecState.Stop)
    const beatFactory = useRef(BeatFactory(ctx, status))
    useEffect(()=>{
        beatFactory.current = BeatFactory(ctx,status)
    },[ctx, status])

    const [ cacheBeats , setCacheBeats ] = useState<BeatState[]>([])
    const [ currentBeat, setCurrentBeat ] = useState<BeatState|null>(null)
    const tic = useTimer(currentBeat)

    useEffect(()=>{
        setCacheBeats(pre=>{
            pre.forEach((beat,i) =>{
                if( beat.action == StrokeAction.Stroke || beat.action == StrokeAction.NotStroke){
                    pre[i] = beatFactory.current.CreateBeatStatus(BeatMode.Normal)
                }
            })
            return pre
        })
    },[status.currentEdgeLevel])

    useEffect(()=>{
        if(cacheBeats.length > 0 && execState == ExecState.Run){
            console.log("next",cacheBeats)
            lastTimeRef.current = new Date().getTime()
            setCurrentBeat(cacheBeats[0])
            if(cacheBeats.length > 0){
                cacheBeats.shift()
                console.log("setCacheBeats 1",cacheBeats)
                if(status.currentOrgasm < ctx.OrgamsTimes ){
                    cacheBeats.push(beatFactory.current.CreateBeatStatus(BeatMode.Normal))
                    setCacheBeats(cacheBeats)
                }
            }
        }
    },[cacheBeats, ctx.OrgamsTimes, execState, status.currentOrgasm, tic])


    let Start = useCallback(()=>{
        setExecState(ExecState.Run)
        let newCacheBeat: BeatState[] = []
        for(let i=0;i<CATCH_SIZE;i++){
            let newBeatState = beatFactory.current.CreateBeatStatus(BeatMode.Normal)
            newCacheBeat.push(newBeatState)
        }
        setCacheBeats(newCacheBeat)
        setCurrentBeat(beatFactory.current.CreateBeatStatus(BeatMode.Normal))
    },[beatFactory])

    let Stop = useCallback(()=>{
        setExecState(ExecState.Stop)
        setCurrentBeat(null)
        setCacheBeats([])
    },[])


    let Pause = useCallback(()=>{
        if(currentBeat != null){
            setExecState(ExecState.Pause)
            let remainPeriod = Math.trunc(currentBeat.period - (new Date().getTime() - lastTimeRef.current)/PeriodSpeed)
            pauseBeatRef.current = {...currentBeat, period: remainPeriod}
            setCurrentBeat(null)
        }
    },[currentBeat])

    let Resume = useCallback(()=>{
        if(pauseBeatRef.current == null || pauseBeatRef.current == undefined){
            return
        }
        lastTimeRef.current = new Date().getTime()
        setCurrentBeat(pauseBeatRef.current)
        setExecState(ExecState.Run)
    },[])

    let Orgams = useCallback(()=>{
        if(execState == ExecState.Stop ){
            return
        }
        setCurrentBeat(null)
        let newCacheBeat: BeatState[] = [beatFactory.current.CreateBeatStatus(BeatMode.Orgasm),beatFactory.current.CreateBeatStatus(BeatMode.Relex)]
        if( status.currentOrgasm < ctx.OrgamsTimes ){
            for(let i=2;i<CATCH_SIZE;i++){
                let newBeatState = beatFactory.current.CreateBeatStatus(BeatMode.Normal)
                newCacheBeat.push(newBeatState)
            }
        }
        setCacheBeats(newCacheBeat)
    },[ctx.OrgamsTimes, execState, status.currentOrgasm])


    let Edge = useCallback(()=>{
        if(execState == ExecState.Stop ){
            return
        }
        setCurrentBeat(null)
        let newCacheBeat: BeatState[] = [beatFactory.current.CreateBeatStatus(BeatMode.Edge)]
        for(let i=1;i<CATCH_SIZE;i++){
            let newBeatState = beatFactory.current.CreateBeatStatus(BeatMode.Normal)
            newCacheBeat.push(newBeatState)
        }
        setCacheBeats(newCacheBeat)
    },[execState])

    return [execState, currentBeat, cacheBeats, { Start,Stop,Pause,Resume,Orgams,Edge}]


}

const useTimer = (currentBeatState : BeatState|null): boolean =>{
    let timerRef = useRef<NodeJS.Timeout[]>([])
    const [tic, setTic] = useState(false)

    let tictac = useCallback(()=>{
        setTic(t=>!t)
    },[])
    useEffect(()=>{
        if(currentBeatState == null){
            timerRef.current.forEach(t=>{ clearTimeout(t) })
            timerRef.current = []
        }else{
            timerRef.current.forEach(t=>{ clearTimeout(t) })
            timerRef.current = []
            timerRef.current.push(setTimeout(tictac,(currentBeatState.period+1)*PeriodSpeed))
        }
    },[currentBeatState, tictac])
    return tic
}

export default TimeRuner