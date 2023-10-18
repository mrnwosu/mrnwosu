import { type NextPage } from "next";
import { useEffect, useState } from 'react'
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "../utils/api";

const Home: NextPage = () => {

  const greetings = ['Hello!', '¡Bojour!', '¡Hola!', 'Hallo!', '¡Ola!']
  const [greetingIndex, setIndex] = useState(0)

  useEffect(() => {
    setTimeout(() => {
      setIndex((greetingIndex + 1) % 5);
    }, 1000)
  }, [greetingIndex]);

  


  // const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Head>
        <title>Mr. Nwosu</title>
        <meta name="description" content="Personal/Professional Website for Ike Nwosu" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen">
        <div className=" bg-black opacity-30 relative w-screen h-5/6 overflow-hidden">
          <video autoPlay muted loop src="./promo.mp4" className=" object-cover absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10"></video>
        </div>

      </main>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined },
  );

  return (
    <div className="flex flex-col items-center justify-center h-1/2">
    </div>
  );
};
