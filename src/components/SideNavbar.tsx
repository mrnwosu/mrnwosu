import { SideIconLink } from "./Icons"
import Delete from '@mui/icons-material/Delete' 
import DeleteForever from '@mui/icons-material/DeleteForever' 
import CurrencyExchangeSharpIcon from '@mui/icons-material/CurrencyExchangeSharp';
import Diversity3SharpIcon from '@mui/icons-material/Diversity3Sharp';
import EmojiPeople from '@mui/icons-material/EmojiPeople';
import StarBorderSharpIcon from '@mui/icons-material/StarBorderSharp';
import Camera from "@mui/icons-material/Camera";


export const SideNavBar = function(){
    return (
        <nav className=" fixed bg-slate-900 border-r-emerald-900 border-r-2 h-screen w-fit p-3
         flex flex-col gap-2
        ">
            <Camera
                sx={{fontSize: 72}}
                className="  py-3 px-1 flex flex-col items-center text-emerald-600"
            />
            <div className=" flex-auto"></div>
            <SideIconLink
                href="/#"
                icon={EmojiPeople}
                description={'About Me'}
                size={36}
            />
            <SideIconLink
                href="/#"
                icon={CurrencyExchangeSharpIcon}
                description={'Skills'}
                size={36}
            />
            <SideIconLink
                href="/#"
                icon={Diversity3SharpIcon}
                description={'Fields'}
                size={36}
            />
            <SideIconLink
                href="/#"
                icon={StarBorderSharpIcon}
                description={'Playground!'}
                size={36}
            />
        </nav>
    )
}