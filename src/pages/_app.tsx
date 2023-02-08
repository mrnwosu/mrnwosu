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

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <div className=" text-white">
        <SideNavBar/>
        <div>
          <div className=" fixed flex justify-end w-screen h-12 px-4">
            <TopIconLink 
              href="https://github.com/mrnwosu"
              icon={GitHub}
              description={""}
              size={36}
            />
            <TopIconLink 
              href="https://www.linkedin.com/in/ikenwosu/"
              icon={LinkedInIcon}
              description={""}
              size={36}
            />
            <TopIconLink 
              href="https://www.instagram.com/naijapsi5/"
              icon={InstagramIcon}
              description={""}
              size={36}
            />
          </div>
          <div className=" bg-gradient-to-b h-screen w-screen from-slate-900 via-slate-800 to-slate-900">
              <Component {...pageProps}/>
          </div>
        </div>
      </div>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
