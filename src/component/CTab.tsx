'use client'
import { useCallback, useContext, useEffect, useState } from "react"
import styles from "./CTab.module.css"
import { TagName__Nil, TagName__Starting, ctxTagStore } from "@/store/TagStore"
import { IoCaretForwardOutline, IoSettingsOutline } from "react-icons/io5"
import { IconType } from "react-icons"

interface CTabBodyProps {
    children: JSX.Element
    TagName: string
}

const CTabBody = (props: CTabBodyProps)=>{
    let [ isActive, setActive ]  = useState<boolean>(false)
    let tagStore = useContext(ctxTagStore)
    useEffect(()=>{
        if(tagStore.getActiveTag() == TagName__Nil&& props.TagName == TagName__Starting){
            tagStore.setActiveTag(TagName__Starting)
            setActive(true)
        } 
        tagStore.registry((tag)=>{
            if(tag == props.TagName){
                setActive(true)
            }else{
                setActive(false)
            }
        })
    },[ctxTagStore])
    return <>
    <div className={`${styles["tabbody"]}`}>
        {isActive && props.children}
    </div>
    </>
}

interface CTabProps {
    TagName: string
    icon: string
}

export const CTab = (props: CTabProps) => {

    const icons: { [key:string]:IconType }= {
        "IoCaretForwardOutline":IoCaretForwardOutline,
        "IoSettingsOutline":IoSettingsOutline,
    }

    let tagStore = useContext(ctxTagStore)
    let doClickTab = useCallback(()=>{
        tagStore.setActiveTag(props.TagName)
    },[tagStore])
    let MyIcon = icons[props.icon]

    return <>
        <div className={`${styles["tabs"]}`}>
            <div className={`${styles["tab"]}`} onClick={doClickTab}>
                <MyIcon/>
                <label>{props.TagName}</label>
            </div>
        </div>
    </>
}

export default CTabBody