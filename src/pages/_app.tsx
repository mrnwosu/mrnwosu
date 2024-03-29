import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { Analytics } from '@vercel/analytics/react'

import { api } from "../utils/api";
import "../styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => (
  <>
    <Analytics/>
    {/* // <SessionProvider session={session}> */}
    <div className=" text-white overflow-clip">
      <div>
        <div className=" h-screen w-screen bg-gradient-to-b">
          <Component {...pageProps} />
        </div>
      </div>
    </div>
    {/* // </SessionProvider> */}
  </>
);

export default api.withTRPC(MyApp);
