import Link from "next/link"
import type { OverridableComponent } from "@mui/material/OverridableComponent"
import type { SvgIconTypeMap } from "@mui/material/SvgIcon"


type props = {
    href: string, 
    description: string,
    icon: OverridableComponent<SvgIconTypeMap>
}

export const SideIconLink = function(props: props){
    return (
        <Link
            href={props.href}
            className=" py-3 px-1 flex flex-col items-center text-emerald-700 bg-slate-800 rounded-xl hover:text-white hover:text-slate-700"
            
        >
            <props.icon sx={{fontSize: 36}}/>
            <p className=" text-xs">{props.description}</p>
        </Link>
    )

}