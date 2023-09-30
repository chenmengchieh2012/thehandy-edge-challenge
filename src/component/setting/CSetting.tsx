'use client'

import { useCallback, useContext, useEffect, useRef } from "react"
import CInput from "../CInput"
import styles from "./CSetting.module.css"
import { CtxSettingProps, MAX_BEAT, MIN_BEAT } from "@/store/SettingProp"
import CButton from "../CButton"


const CSetting = ()=>{
    const settingProps = useContext(CtxSettingProps)
    const orgasmTimeInputRef = useRef<HTMLInputElement>(null)
    const preferOrgasmPeriodInputRef = useRef<HTMLInputElement>(null)
    const edgeTimeInputRef = useRef<HTMLInputElement>(null)
    const relexPeriodInputRef = useRef<HTMLInputElement>(null)
    const postOrgasmTortureMinPeriodInputRef = useRef<HTMLInputElement>(null)
    const postOrgasmTortureMaxPeriodInputRef = useRef<HTMLInputElement>(null)
    const minBeatInputRef = useRef<HTMLInputElement>(null)
    const maxBeatInputRef = useRef<HTMLInputElement>(null)
    const beatsStepSizeInputRef = useRef<HTMLInputElement>(null)
    const minStrokePeriodInputRef = useRef<HTMLInputElement>(null)
    const maxStrokePeriodInputRef = useRef<HTMLInputElement>(null)
    const minStopPeriodInputRef = useRef<HTMLInputElement>(null)
    const maxStopPeriodInputRef = useRef<HTMLInputElement>(null)

    const successBtnRef = useRef<HTMLButtonElement>(null)

    let doSetting = useCallback(()=>{
        let orgasmtime = orgasmTimeInputRef.current? orgasmTimeInputRef.current.value : 1
        let preferOrgasmPeriod = preferOrgasmPeriodInputRef.current? preferOrgasmPeriodInputRef.current.value : 10
    
        let edgeTimes = edgeTimeInputRef.current? edgeTimeInputRef.current.value : 1
        let relexPeriod = relexPeriodInputRef.current? relexPeriodInputRef.current.value : 10
        let postOrgasmTortureMinPeriod = postOrgasmTortureMinPeriodInputRef.current? postOrgasmTortureMinPeriodInputRef.current.value : 1
        let postOrgasmTortureMaxPeriod = postOrgasmTortureMaxPeriodInputRef.current? postOrgasmTortureMaxPeriodInputRef.current.value : 1
        let minBeatInput = minBeatInputRef.current? minBeatInputRef.current.value : 30
        let maxBeatInput = maxBeatInputRef.current? maxBeatInputRef.current.value : 180
        let beatsStepSize = beatsStepSizeInputRef.current? beatsStepSizeInputRef.current.value : 30
        let minStrokePeriod = minStrokePeriodInputRef.current? minStrokePeriodInputRef.current.value : 10
        let maxStrokePeriod = maxStrokePeriodInputRef.current? maxStrokePeriodInputRef.current.value : 60
        let minStopPeriod = minStopPeriodInputRef.current? minStopPeriodInputRef.current.value : 0
        let maxStopPeriod = maxStopPeriodInputRef.current? maxStopPeriodInputRef.current.value : 30
        settingProps.setSettingProps({
            OrgamsTimes: Number(orgasmtime),
            PreferOrgasmPeriod: Number(preferOrgasmPeriod),
            EdgeTimes: Number(edgeTimes),
            RelexPeriod :Number(relexPeriod),
            PostOrgasmTortureMinPeriod: Number(postOrgasmTortureMinPeriod),
            PostOrgasmTortureMaxPeriod: Number(postOrgasmTortureMaxPeriod),
            MinBeatInput: Number(minBeatInput),
            MaxBeatInput:  Number(maxBeatInput),
            BeatsStepSize: Number(beatsStepSize),
            MinStrokePeriod:  Number(minStrokePeriod),
            MaxStrokePeriod:  Number(maxStrokePeriod),
            MinStopPeriod:  Number(minStopPeriod),
            MaxStopPeriod:  Number(maxStopPeriod),
        })
    },[orgasmTimeInputRef.current])

    return <>
        <div className={`${styles["container"]}`}>
            <CInput type="number" defaultValue={1} min={1} label={"orgasm times"} inputRef={orgasmTimeInputRef}></CInput>
            <CInput type="number" defaultValue={10}  label={"edge times"} inputRef={edgeTimeInputRef}></CInput>
            <CInput type="number" defaultValue={10} min={10} label={"prefer orgasm period"} inputRef={preferOrgasmPeriodInputRef}></CInput>
            <CInput type="number" defaultValue={10}  min={0} label={"post orgasm torture min duration (min)"} inputRef={postOrgasmTortureMinPeriodInputRef}></CInput>
            <CInput type="number" defaultValue={10}  label={"post orgasm torture max duration (min)"} inputRef={postOrgasmTortureMaxPeriodInputRef}></CInput>
            <CInput type="number" defaultValue={10}  label={"relex period"} inputRef={relexPeriodInputRef}></CInput>
            <CInput type="number" defaultValue={30}   min={MIN_BEAT} label={"min beat"} inputRef={minBeatInputRef}></CInput>
            <CInput type="number" defaultValue={180}   min={MAX_BEAT} label={"max beat"} inputRef={maxBeatInputRef}></CInput>
            <CInput type="number" defaultValue={10}  min={10} label={"beats step size"} inputRef={beatsStepSizeInputRef}></CInput>
            <CInput type="number" defaultValue={10}  min={10} label={"min Stroke Period (sec)"} inputRef={minStrokePeriodInputRef}></CInput>
            <CInput type="number" defaultValue={30}  min={30} label={"max Stroke Period (sec)"} inputRef={maxStrokePeriodInputRef}></CInput>
            <CInput type="number" defaultValue={10}  min={10} label={"min Stop Period (sec)"} inputRef={minStopPeriodInputRef}></CInput>
            <CInput type="number" defaultValue={30}  min={30} label={"max Stop Period (sec)"} inputRef={maxStopPeriodInputRef}></CInput>
            <CButton label="OK" onClick={doSetting} buttonRef={successBtnRef}></CButton>
        </div>
    </>
}

export default CSetting