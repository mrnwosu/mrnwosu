import Link from "next/link"
import type { OverridableComponent } from "@mui/material/OverridableComponent"
import type { SvgIconTypeMap } from "@mui/material/SvgIcon"


type props = {
    href: string, 
    description: string,
    icon: OverridableComponent<SvgIconTypeMap>,
    size: number
}

export const SideIconLink = function(props: props){
    return (
        <Link
            href={props.href}
            className=" py-3 px-1 flex flex-col items-center text-emerald-700 bg-slate-800 rounded-xl hover:text-white hover:text-slate-700"
            
        >
            <props.icon sx={{fontSize: props.size}}/>
            <p className=" text-xs">{props.description}</p>
        </Link>
    )
}

export const TopIconLink = function(props: props){
    return (
        <Link
            href={props.href}
            className=" py-3 px-1 flex flex-col items-center text-gray-300 hover:text-white rounded-xl"
        >
            <props.icon sx={{fontSize: props.size}}/>
        </Link>
    ) 
}