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
    // <SessionProvider session={session}>
    <div className=" text-white">
      <div>
        <div className=" h-screen w-screen bg-gradient-to-b">
          <Component {...pageProps} />
        </div>
      </div>
    </div>
    // </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
