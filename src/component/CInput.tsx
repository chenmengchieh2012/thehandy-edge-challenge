import { InputHTMLAttributes } from "react"
import styles from "./CInput.module.css"
export interface CInputProps extends React.InputHTMLAttributes<HTMLInputElement>{
    label: any
    labelInline?: boolean
    className?: string
    inputRef: React.Ref<HTMLInputElement>
}
const CInput = (props: CInputProps)=>{
    
    let inputProps = Object.assign({...props})
    delete(inputProps.labelInline)
    delete(inputProps.inputRef)
    return <>
        <div className={`${props.className} ${styles["cinput"]}`} style={{display:`${props.labelInline ? "flex" : "block"}`}} >
            <label>
                {props.label}
            </label>
            <input {...inputProps} ref={props.inputRef} style={{flex:`${props.labelInline ? "1" : "0"}`}}></input>
        </div>
    </>
}

export default CInput