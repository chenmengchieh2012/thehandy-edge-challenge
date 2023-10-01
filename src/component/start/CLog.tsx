import React, { useImperativeHandle, useState } from "react"
import { BeatState } from "./BeatFactory"
import CCacheList from "./CCacheList"


export interface FCLog {
    addLog: (lastSuccessTime: number , beatState: BeatState) => void
}

interface CLogProps {
}



const CLog = React.forwardRef<FCLog,CLogProps>((props,ref)=>{
    let [ logs , setLogs] = useState<BeatState[]>([])
    useImperativeHandle(ref,()=>({
        addLog:(remainTime: number,successBeatState: BeatState)=>{
            if(remainTime != 0 ){
                successBeatState.period = successBeatState.period - remainTime
            }
            if( successBeatState.period != 0){
                setLogs([successBeatState,...logs])
            }
        }
    }))
    return <>
        <CCacheList cacheBeat={logs}></CCacheList>
    </>
})

CLog.displayName="CLog"

export default CLog