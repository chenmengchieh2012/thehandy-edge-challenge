import { InputHTMLAttributes } from "react"
import styles from "./CInput.module.css"
export interface CInputProps extends React.InputHTMLAttributes<HTMLInputElement>{
    label: any
    inline?: boolean
    className?: string
    inputRef: React.Ref<HTMLInputElement>
}
const CInput = (props: CInputProps)=>{
    return <>
        <div className={`${props.className} ${styles["cinput"]}`} style={{display:`${props.inline ? "flex" : "block"}`}} >
            <label style={{flex:`${props.inline ? "1" : "0"}`}}>
                {props.label}
            </label>
            <input {...props} ref={props.inputRef} style={{flex:`${props.inline ? "1" : "0"}`}}></input>
        </div>
    </>
}

export default CInput