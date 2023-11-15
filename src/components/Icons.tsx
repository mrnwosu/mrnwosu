import Link from "next/link"
import type { OverridableComponent } from "@mui/material/OverridableComponent"
import type { SvgIconTypeMap } from "@mui/material/SvgIcon"

type props = {
    href: string, 
    description: string,
    icon: OverridableComponent<SvgIconTypeMap>,
    size: number
}

export const TopIconLink = function(props: props){
    return (
        <Link
            href={props.href}
            className=" py-3 px-1 flex flex-col items-center transition duration-300 text-claw_diez hover:text-claw_nueve rounded-xl"
        >
            <props.icon sx={{fontSize: props.size}}/>
        </Link>
    ) 
}