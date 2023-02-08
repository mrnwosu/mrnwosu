import Link from "next/link"

export const SideNavBar = function(){
    return (
        <nav className=" fixed bg-slate-900 border-r-emerald-900 border-r-2 h-screen w-fit p-3">
            <ul>
                <li>
                    Ike. ✨
                </li>
                <li>
                    About Me.
                </li>
                <li>
                    Skills
                </li>
                <li>
                    Projects
                </li>
                <li>
                    Playground!
                </li>
                <li>
                    My Friends!
                </li>
            </ul>
        </nav>
    )
}