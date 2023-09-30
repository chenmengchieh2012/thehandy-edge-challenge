import { InputHTMLAttributes } from "react"
import styles from "./CButton.module.css"
export interface CButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>{
    label: string
    buttonRef?: React.Ref<HTMLButtonElement>
}
const CButton = (props: CButtonProps)=>{
    return <>
        <button className={`${styles["cbutton"]}`} {...props} ref={props.buttonRef}>
            {props.label}
        </button>
    </>
}

export default CButton