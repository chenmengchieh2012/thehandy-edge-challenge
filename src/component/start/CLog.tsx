import React, { useCallback, useImperativeHandle, useRef, useState } from "react"
import { BeatState, StrokeAction } from "./BeatFactory"
import CCacheList from "./CCacheList"
import { Line, Scatter } from "react-chartjs-2";

import {
    Chart as ChartJS,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
} from 'chart.js';
import CButton from "../CButton";
import { StrokeActionLabelMap } from "./CDashboard";

export interface FCLog {
    addLog: (lastSuccessTime: number , beatState: BeatState) => void
}

interface CLogProps {
}

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);


export const options = {
    responsive: true,
    scales: {
        y: {
          beginAtZero: true,
        }
    }
};

enum LogMode {
    Line, Table
}

interface ScatterDataPoint { x: number , y: number, pointRadius: number, color: string}

const CLog = React.forwardRef<FCLog,CLogProps>((props,ref)=>{
    let [ logs , setLogs] = useState<BeatState[]>([])
    let [ mode, setMode ] = useState<LogMode>(LogMode.Line)
    let [ scatterData, setScatterData ] = useState<ScatterDataPoint[]>([])
    let scattorChartRef = useRef<ChartJS<"scatter", ScatterDataPoint[], string>>(null)
    let [ xRange , setXRange] = useState<[number,number]>([0,20])
    let download = useCallback(()=>{
        let csv = logs.map(log=>{return `${log.beat},${StrokeActionLabelMap[log.action]},${log.period}\n`})
        var myData = new Blob(csv, {type: 'text/csv'});
        var csvURL = window.URL.createObjectURL(myData);
        let tempLink = document.createElement('a');
        tempLink.href = csvURL;
        tempLink.setAttribute('download', 'filename.csv');
        tempLink.click();
    },[logs])
    useImperativeHandle(ref,()=>({
        addLog:(remainTime: number,successBeatState: BeatState)=>{
            if(remainTime != 0 ){
                successBeatState.period = successBeatState.period - remainTime
            }
            if( successBeatState.period != 0){
                setLogs([successBeatState,...logs])
                let color = "#000"
                let pointRadius = 5
                if(scatterData.length > 0){
                    let lastdata = scatterData[scatterData.length-1]
                    if(successBeatState.action == StrokeAction.Edge){
                        color = "green"
                        pointRadius = 10
                    }
                    if(successBeatState.action == StrokeAction.Torture){
                        color = "red"
                        pointRadius = 10
                    }
                    let from: ScatterDataPoint = {x:lastdata.x,y:successBeatState.beat,pointRadius:pointRadius, color: color}
                    let to: ScatterDataPoint = {x:lastdata.x+successBeatState.period,y:successBeatState.beat,pointRadius:pointRadius, color: color}
                    setScatterData(s=>[...s,from,to])
                    console.log("xrange",scatterData.length,xRange)
                    setXRange([scatterData[scatterData.length-20 > 0 ? scatterData.length-20: 0].x,scatterData[scatterData.length-1].x])
                }else{
                    let from: ScatterDataPoint = {x:0,y:successBeatState.beat,pointRadius:pointRadius, color: color}
                    let to: ScatterDataPoint = {x:successBeatState.period,y:successBeatState.beat,pointRadius:pointRadius, color: color}
                    setScatterData(s=>[...s,from,to])
                }
            }
        }
    }))
    let doChangeMode = useCallback(()=>{
        if(mode == LogMode.Line){
            setMode(LogMode.Table)
        }else{
            setMode(LogMode.Line)
        }
    },[mode])
    return <>
        <CButton onClick={doChangeMode} label={"Mode"}/>
        <CButton onClick={download} label={"Download"}/>
        {mode == LogMode.Table && <CCacheList cacheBeat={logs}></CCacheList> }
        {mode == LogMode.Line && 
        <div style={{minWidth:"120px",minHeight:"64px"}}>
            <Scatter ref={scattorChartRef} options={{
                ...options,
                showLine: true,
                borderColor: "#777",
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                    x: {
                        min: xRange[0],
                        max: xRange[1],
                    }
                }
            }}
             data={{
                datasets: [
                    {
                        label: 'Stroke History',
                        data: scatterData.map(s=>{return {x:s.x,y:s.y}}),
                        pointBackgroundColor: scatterData.map(s=>{return s.color}),
                        pointRadius: scatterData.map(s=>{return s.pointRadius}),
                    },
                ]

            }} updateMode="resize" />
        </div>
        }
    </>
})

CLog.displayName="CLog"

export default CLog