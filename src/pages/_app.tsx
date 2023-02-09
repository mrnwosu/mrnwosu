import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { TopIconLink } from "../components/Icons";
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHub from "@mui/icons-material/GitHub";

import { api } from "../utils/api";
import "../styles/globals.css";
import { SideNavBar } from "../components/SideNavbar";
import { string } from "zod";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {

  const topLinkProps = [
    {href: "https://github.com/mrnwosu", icon: GitHub, description: "", size: 36 },
    {href: "https://www.linkedin.com/in/ikenwosu/", icon: LinkedInIcon, description: "", size: 36 },
    {href: "https://www.instagram.com/naijapsi5/", icon: InstagramIcon, description: "", size: 36 },
  ]

  return (
    <SessionProvider session={session}>
      <div className=" text-white">
        <SideNavBar/>
        <div>
          <div className=" fixed flex justify-end w-screen h-12 px-4">
            {topLinkProps.map((l, i) => {
              return (
              <TopIconLink 
                key={i}
                href={l.href}
                icon={l.icon}
                description={l.description}
                size={l.size}
              />)
            })}
          </div>
          <div className=" bg-gradient-to-b h-screen w-screen bg-red-500">
              <Component {...pageProps}/>
          </div>
        </div>
      </div>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
