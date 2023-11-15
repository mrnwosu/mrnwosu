import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { TopIconLink } from "../components/Icons";

import { api } from "../utils/api";
import "../styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {

  

  return (
    <SessionProvider session={session}>
      <div className=" text-white">
        {/* <SideNavBar/> */}
        <div>
          
          <div className=" bg-gradient-to-b h-screen w-screen">
              <Component {...pageProps}/>
          </div>
        </div>
      </div>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
