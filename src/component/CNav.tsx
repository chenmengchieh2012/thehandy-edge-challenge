'use client'
import { useCallback, useEffect, useState } from "react";
import { IoReorderThreeOutline } from "react-icons/io5";


const MEDIA_WIDTH = 600

const CNav = (props:{children: JSX.Element,})=>{
    const [collapse, setCollapse] = useState(false);
    const [open, setOpen] = useState(false);
    useEffect(()=>{
        let fCollapse = ()=>{
            console.log("gogo")
            if(window.innerWidth < MEDIA_WIDTH){
                setCollapse(true)
            }else{
                setCollapse(false)
            }
        }
        window.addEventListener("resize", fCollapse);
        fCollapse()
        return ()=>{
            window.removeEventListener("resize", fCollapse)
        }
    },[])

    let doOpenNav = useCallback(()=>{
        setOpen(b=>!b)
    },[])

    return <>
        <div>
            {collapse && 
                <div onClick={doOpenNav}>
                    <IoReorderThreeOutline></IoReorderThreeOutline>
                </div>
            }
            {(!collapse || open) && 
                <div>
                    {props.children}
                </div>
            }
        </div>
    </>
}

export default CNav