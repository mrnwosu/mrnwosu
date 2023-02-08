import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "../utils/api";

import "../styles/globals.css";
import { SideNavBar } from "../components/SideNavbar";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <div className=" bg-slate-800 text-white">
        <SideNavBar/>
        <Component {...pageProps}/>
      </div>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
