import { InputHTMLAttributes } from "react"
import styles from "./CButton.module.css"


export enum ButtonMode {
    None = "", Success = "success", Warning = "warning", Alert = "alert"
}
export interface CButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>{
    label: any
    mode?: ButtonMode
    buttonRef?: React.Ref<HTMLButtonElement>
}
const CButton = (props: CButtonProps)=>{
    let mode = ( props.mode == undefined ? ButtonMode.None : props.mode )
    return <>
        <button className={`${styles["cbutton"]} ${styles[mode]}`} {...props} ref={props.buttonRef}>
            {props.label}
        </button>
    </>
}

export default CButton