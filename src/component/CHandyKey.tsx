'use client'
import { IoKeyOutline } from "react-icons/io5"
import CInput from "./CInput"
import { useCallback, useContext, useDeferredValue, useEffect, useState } from "react"
import { CtxHandyKeyStore } from "@/store/HandyKey"

const CHandyKey = ()=>{
    const ctxHandyKey = useContext(CtxHandyKeyStore)
    let [inputValue, setInputValue] = useState<string>("")
    let handyKey = useDeferredValue(inputValue)
    let onChangeHandyKey = useCallback((e: React.ChangeEvent<HTMLInputElement>)=>{
        let key = e.currentTarget.value
        setInputValue(key)
    },[])
    useEffect(()=>{
        ctxHandyKey.setHandyKey(handyKey)
    },[ctxHandyKey, handyKey])
    return <>
    <CInput onChange={onChangeHandyKey} labelInline={true} label={<IoKeyOutline/>} inputRef={null}></CInput>
    </>
}

export default CHandyKey