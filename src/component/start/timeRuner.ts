import { SettingProps } from "@/store/SettingProp"
import { RunningStatus } from "@/store/StatusStore"
import { useCallback, useEffect, useRef, useState } from "react"
import BeatFactory, { BeatMode, BeatState } from "./BeatFactory"

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

const TimeRuner = (ctx: SettingProps, status: RunningStatus):[ ExecState , BeatState|null, BeatState[], TimeRunerAction] =>{
    let pauseBeatRef = useRef<BeatState|null>()
    let lastTimeRef = useRef<number>(0)
    let [ execState, setExecState ] = useState(ExecState.Stop)

    const beatFactory = useRef(BeatFactory(ctx, status))

    const [ cacheBeats , setCacheBeats ] = useState<BeatState[]>([])
    const [ currentBeat, setCurrentBeat ] = useState<BeatState|null>(null)
    const tic = useTimer(currentBeat)

    useEffect(()=>{
        console.log("tic!!",cacheBeats.length)
        if(cacheBeats.length > 0){
            let nextCacheBeat = cacheBeats[0]
            setCurrentBeat(nextCacheBeat)
            console.log("nextCacheBeat!!",nextCacheBeat)
            lastTimeRef.current = new Date().getTime()
            cacheBeats.shift()
            if(status.startTime > 0 && status.currentOrgasm < ctx.OrgamsTimes){
                for(let i=cacheBeats.length;i<CATCH_SIZE;i++){
                    let newBeatState = beatFactory.current.CreateBeatStatus(BeatMode.Normal)
                    cacheBeats.push(newBeatState)
                }
                setCacheBeats(cacheBeats)
            }
        }
    },[beatFactory, cacheBeats, ctx.OrgamsTimes, status.currentOrgasm, status.startTime, tic])

    let Start = useCallback(()=>{
        setExecState(ExecState.Run)
        setCurrentBeat(beatFactory.current.CreateBeatStatus(BeatMode.Normal))
        let cacheBeats: BeatState[] = [];
        for (let i = 0; i < CATCH_SIZE; i++) {
            let beatState = beatFactory.current.CreateBeatStatus(BeatMode.Normal)
            cacheBeats.push(beatState)
        }
        setCacheBeats(cacheBeats)
    },[beatFactory])

    let Stop = useCallback(()=>{
        setExecState(ExecState.Stop)
        setCurrentBeat(null)
        setCacheBeats([])
    },[])


    let Pause = useCallback(()=>{
        if(currentBeat != null){
            setExecState(ExecState.Pause)
            let remainPeriod = (currentBeat.period - (new Date().getTime() - lastTimeRef.current))/1000
            pauseBeatRef.current = {...currentBeat, period: remainPeriod}
            setCurrentBeat(null)
        }
    },[currentBeat])

    let Resume = useCallback(()=>{
        if(pauseBeatRef.current == null){
            return
        }
        setExecState(ExecState.Run)
        setCurrentBeat(pauseBeatRef.current)
    },[])

    let Orgams = useCallback(()=>{
        setCurrentBeat(beatFactory.current.CreateBeatStatus(BeatMode.Orgasm))
        setCacheBeats([beatFactory.current.CreateBeatStatus(BeatMode.Relex)])
    },[beatFactory])


    let Edge = useCallback(()=>{
        setCurrentBeat(beatFactory.current.CreateBeatStatus(BeatMode.Edge))
        setCacheBeats([])
    },[beatFactory])

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
            timerRef.current.push(setTimeout(tictac,(currentBeatState.period+1)*100))
        }
    },[currentBeatState, tictac])
    return tic
}

export default TimeRuner