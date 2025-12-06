import { Analytics } from "@vercel/analytics/react";
import { type ReactNode } from "react";
import "../styles/globals.css";
import { TRPCReactProvider } from "@utils/trpc-provider";
import { Navigation } from "@components/Navigation";
import { LoadingScreen } from "@components/LoadingScreen";

export const metadata = {
  title: "Mr. Nwosu",
  description: "Personal/Professional Website for Ike Nwosu",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <TRPCReactProvider>
          <Analytics />
          <LoadingScreen />
          <div className="overflow-clip text-white">
            <div className="h-screen w-screen bg-gradient-to-b">
              <Navigation />
              {children}
            </div>
          </div>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
