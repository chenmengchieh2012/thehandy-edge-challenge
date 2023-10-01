import { InputHTMLAttributes } from "react"
import styles from "./CInput.module.css"
export interface CInputProps extends React.InputHTMLAttributes<HTMLInputElement>{
    label: any
    className?: string
    inputRef: React.Ref<HTMLInputElement>
}
const CInput = (props: CInputProps)=>{
    return <>
        <div className={`${props.className} ${styles["cinput"]}`}>
            <label>
                {props.label}
            </label>
            <input {...props} ref={props.inputRef}></input>
        </div>
    </>
}

export default CInput