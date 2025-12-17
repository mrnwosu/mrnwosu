import { Analytics } from "@vercel/analytics/react";
import { type ReactNode } from "react";
import type { Metadata } from "next";
import "../styles/globals.css";
import { TRPCReactProvider } from "@utils/trpc-provider";
import { Navigation } from "@components/Navigation";
import { LoadingScreen } from "@components/LoadingScreen";

export const metadata: Metadata = {
  title: {
    default: "Mr. Nwosu",
    template: "%s | Mr. Nwosu",
  },
  description:
    "Ike Nwosu - Software engineer with 10+ years of experience in .NET, React, TypeScript, and cloud technologies. Passionate about building great software and pushing physical limits.",
  keywords: [
    "Ike Nwosu",
    "Mr Nwosu",
    "Software Engineer",
    "Full Stack Developer",
    ".NET Developer",
    "React Developer",
    "TypeScript",
    "Azure",
    "C#",
    "Web Development",
  ],
  authors: [{ name: "Ike Nwosu" }],
  creator: "Ike Nwosu",
  metadataBase: new URL("https://ike-nwosu.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ike-nwosu.com",
    siteName: "Mr. Nwosu",
    title: "Mr. Nwosu",
    description:
      "Software engineer with 10+ years of experience. Passionate about .NET, React, cloud technologies, and fitness.",
    images: [
      {
        url: "/winner.webp",
        width: 1200,
        height: 630,
        alt: "Mr. Nwosu - Software Engineer & Athlete",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <TRPCReactProvider>
          <Analytics />
          <LoadingScreen />
          <div className="min-h-screen text-white">
            <Navigation />
            {children}
          </div>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
