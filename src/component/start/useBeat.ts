import { BaseSettingProps, MIN_BEAT, SettingProps } from "@/store/SettingProp"
import { useCallback, useEffect, useRef, useState } from "react"

// OrgamsTimes : number
// EdgeTimes: number
// RelexPeriod :number
// SpeedUpLevel: number
// PostOrgasmTortureMinPeriod: number
// PostOrgasmTortureMaxPeriod: number
// MinBeatInput: number
// MaxBeatInput: number
// BeatsStepSize: number
// MinStrokePeriod: number
// MaxStrokePeriod: number
// MinStopPeriod: number
// MaxStopPeriod: number

export enum StrokeAction {
    Pause, Stop, Stroke, NotStroke, Torture, Relex
}

export interface BeatState {
    currentOrgasm: number
    currentEdgeTimes: number
    currentEdgeLevel: number
    action: StrokeAction
    beat: number
    period: number
}

interface UseBeatAction {
    setEdgeLevel: (edgeLevel: number)=>void, //1-8
    setOrgams: ()=>void, //
    setEdge:()=>void,
    Pause: ()=>void,
    Resume: ()=>void,
    Stop: ()=>void,
    Start: ()=>void,
}

const NOTSTROKE_RANDOM_ThreadHold = 0.2
const POST_ORGAME_BEATS = 60
const MAX_EDGE_LEVEL = 8

const useBeat = (ctx: SettingProps): [BeatState,UseBeatAction]=>{
    let timerRef = useRef<NodeJS.Timeout[]>([])
    let startTimeRef = useRef<number>(new Date().getTime())
    let lastTimeRef = useRef<number>(0)
    let lastAction = useRef<StrokeAction>(StrokeAction.Stop)
    let previodPeriodRef = useRef<number>(0)
    let remainTimeRef =  useRef<number>(0)
    let currentMaxBeatsRef = useRef<number>((ctx.MaxBeatInput < MIN_BEAT) ? MIN_BEAT : ctx.MaxBeatInput)
    let [ beatState, setBeatState ] = useState<BeatState>({
        currentOrgasm: 0,
        currentEdgeTimes: 0,
        currentEdgeLevel: 1,
        action: StrokeAction.Stop,
        beat: 30,
        period: 0,
    })


    let nextBeatState = useCallback((force?: boolean)=>{
        
        let nextAction = StrokeAction.Stroke
        let nextBeat = 30
        let nextPeriod = 1
        console.log("go next",new Date().toUTCString())

        lastTimeRef.current = new Date().getTime()
        let randNum = Math.random()
            
        //aciton 
        if( randNum < NOTSTROKE_RANDOM_ThreadHold && beatState.currentEdgeLevel >= MAX_EDGE_LEVEL-2){
            nextAction = StrokeAction.NotStroke
        }

        //beats
        let totalSteps = Math.ceil(currentMaxBeatsRef.current - ctx.MinBeatInput)/ctx.BeatsStepSize
        let nextStep = Math.round(randNum * (2/beatState.currentEdgeLevel > 1 ? 1 : 2/beatState.currentEdgeLevel) * totalSteps)
        console.log('maxStep',(2/beatState.currentEdgeLevel > 1 ? 1 : 2/beatState.currentEdgeLevel) * 1,beatState.currentEdgeLevel, JSON.stringify(beatState))
        nextBeat = (nextStep*ctx.BeatsStepSize + ctx.MinBeatInput) 

        let duration = new Date().getTime() - startTimeRef.current

        if( duration/1000/60 > ctx.PreferOrgasmPeriod ){
            nextBeat = ctx.MaxBeatInput - (totalSteps-nextStep)*ctx.BeatsStepSize
        }

        
        //periods
        if(nextAction ==StrokeAction.NotStroke){
            let periodRange = ctx.MaxStopPeriod- ctx.MinStopPeriod
            nextPeriod = ctx.MinStopPeriod + Math.ceil(randNum * periodRange)
        }else if(nextAction ==StrokeAction.Stroke){
            let periodRange = ctx.MaxStrokePeriod- ctx.MinStrokePeriod
            nextPeriod = ctx.MinStrokePeriod + Math.ceil(randNum * periodRange)
        }

        setBeatState((preBeatState)=>{
            preBeatState.action = nextAction            
            console.log('previodPeriodRef.current*1000',nextPeriod)
            return {...preBeatState, action: nextAction, beat: nextBeat, period:nextPeriod}
        })
        console.warn("set",timerRef.current)
        timerRef.current.forEach(t=>{ clearTimeout(t) })
        timerRef.current = []
        timerRef.current.push(setTimeout(nextBeatState,nextPeriod*1000+1000))
    },[timerRef.current,beatState,previodPeriodRef,lastTimeRef, lastAction ,startTimeRef,ctx,currentMaxBeatsRef])


    const setEdgeLevel = useCallback((edgeLevel: number)=>{
        if(beatState.action == StrokeAction.Stop){
            return
        }
        setBeatState(prebeatState=>{
            let nextEdgeLevel = edgeLevel > MAX_EDGE_LEVEL ? MAX_EDGE_LEVEL : edgeLevel
            console.log(' nextEdgeLevel.current', nextEdgeLevel)
            return {...prebeatState, currentEdgeLevel:nextEdgeLevel}
        })
    },[beatState])
    const setOrgams = useCallback(()=>{
        
        if(beatState.action == StrokeAction.Stop){
            return
        }
        let newcurrentOrgasm = beatState.currentOrgasm +1
        
        let nextAction = StrokeAction.Torture
        let nextBeat = POST_ORGAME_BEATS
        let randNum = Math.random()
        let periodRange = ctx.PostOrgasmTortureMaxPeriod- ctx.PostOrgasmTortureMinPeriod
        let nextPeriod =  ctx.PostOrgasmTortureMinPeriod + Math.ceil(randNum * periodRange)

        setBeatState(preBeatState=>{
            return {...preBeatState, action: nextAction, beat: nextBeat, period: nextPeriod, currentOrgasm: newcurrentOrgasm}
        })

        timerRef.current.forEach(t=>{ clearTimeout(t) })
        timerRef.current = []
        timerRef.current.push(setTimeout(()=>{
            
            let nextAction = StrokeAction.Relex
            if(beatState.currentOrgasm >= ctx.OrgamsTimes){
                beatState.action = StrokeAction.Stop
            }
            let nextBeat =  0
            let nextPeriod =  ctx.RelexPeriod*60

            setBeatState(preBeatState=>{ 
                if(preBeatState.currentOrgasm >= ctx.OrgamsTimes){
                    preBeatState.action = StrokeAction.Stop
                    return {...preBeatState}
                }
                return {...preBeatState, action: nextAction, beat: nextBeat, period: nextPeriod}
            })
            timerRef.current.forEach(t=>{ clearTimeout(t) })
            timerRef.current = []
            timerRef.current.push(setTimeout(nextBeatState,(nextPeriod+1)*1000))
        },(nextPeriod+1)*1000))
    },[beatState,nextBeatState,ctx])
    const Pause = useCallback(()=>{
        if(beatState.action == StrokeAction.Stop){
            return
        }
        setBeatState((preBeatState)=>{
            remainTimeRef.current = (preBeatState.period - (new Date().getTime() - lastTimeRef.current))/1000
            lastAction.current = preBeatState.action
            return {...preBeatState, action:StrokeAction.Pause}
        })
    },[timerRef,beatState,ctx])
    const Resume = useCallback(()=>{
        if(beatState.action == StrokeAction.Stop){
            return
        }
        setBeatState((preBeatState)=>{
            console.log('setTimeout 4')
            return {...preBeatState,action:lastAction.current}
        })
        timerRef.current.forEach(t=>{ clearTimeout(t) })
        timerRef.current = []
        timerRef.current.push(setTimeout(nextBeatState,remainTimeRef.current*1000))
        remainTimeRef.current = beatState.period - (new Date().getTime() - lastTimeRef.current)
    },[nextBeatState,beatState,ctx,timerRef])

    const Start = useCallback(()=>{
        startTimeRef.current = new Date().getTime()
        lastTimeRef.current = 0
        console.log("start")
        setBeatState(preBeatState => ({...preBeatState,action: StrokeAction.Stroke}))
        nextBeatState(true)
    },[startTimeRef,ctx,timerRef,lastTimeRef,nextBeatState])
    const Stop = useCallback(()=>{
        timerRef.current.forEach(t=>{ clearTimeout(t) })
        timerRef.current = []
        setBeatState(preBeatState => ({...preBeatState,action: StrokeAction.Stop}))
    },[setBeatState,timerRef])

    const setEdge = useCallback(()=>{
        if(beatState.action == StrokeAction.Stop){
            return
        }
        let nextAction =StrokeAction.NotStroke
        let nextCurrentEdgeTimes =  beatState.currentEdgeTimes+1
        let nextCurrentEdgeLevel =  MAX_EDGE_LEVEL
        let randNum = Math.random()
        let periodRange = ctx.MaxStopPeriod- ctx.MinStopPeriod
        let nextPeriod =  ctx.MinStopPeriod + Math.ceil(randNum * periodRange)
        setBeatState(preBeatState=>{
            return {...preBeatState, action: nextAction, beat: 0, currentEdgeLevel: nextCurrentEdgeLevel, currentEdgeTimes: nextCurrentEdgeTimes, period: nextPeriod}
        })
        lastTimeRef.current = 0;
        timerRef.current.forEach(t=>{ clearTimeout(t) })
        timerRef.current = []
        timerRef.current.push(setTimeout(nextBeatState,(nextPeriod+1)*1000))
    },[timerRef,beatState,setBeatState,nextBeatState])
    return [beatState, {setEdgeLevel,setOrgams,Resume,Start,setEdge,Stop,Pause}]
}

export default useBeat