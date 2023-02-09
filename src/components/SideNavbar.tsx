import { SideIconLink } from "./Icons"
import CurrencyExchangeSharpIcon from '@mui/icons-material/CurrencyExchangeSharp';
import Diversity3SharpIcon from '@mui/icons-material/Diversity3Sharp';
import EmojiPeople from '@mui/icons-material/EmojiPeople';
import StarBorderSharpIcon from '@mui/icons-material/StarBorderSharp';
import Camera from "@mui/icons-material/Camera";
import Link from "next/link";


export const SideNavBar = function(){

    const links = [
        {href: '/about', icon: EmojiPeople, desc: "About Me", size: 36  },
        {href: '/#', icon: CurrencyExchangeSharpIcon, desc: "Skills", size: 36  },
        {href: '/#', icon: Diversity3SharpIcon, desc: "Friends", size: 36  },
        {href: '/#', icon: StarBorderSharpIcon, desc: "Playground!", size: 36  }
    ]

    return (
        <nav className=" fixed bg-slate-900 border-r-emerald-900 border-r-2 h-screen w-fit p-3
         flex flex-col gap-2
        ">
            <Link href={'/'}>
                <Camera
                    sx={{fontSize: 72}}
                    className="  py-3 px-1 flex flex-col items-center text-emerald-600"
                />
            </Link>
            <div className=" flex-auto"></div>
            {links.map((l, i) => {
                return (
                    <SideIconLink
                        key={i}
                        href={l.href}
                        icon={l.icon}
                        description={l.desc}
                        size={l.size}
                    />        
                )
            })}
        </nav>
    )
}