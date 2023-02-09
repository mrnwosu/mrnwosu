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
      <main className="flex min-h-screen">
        <div className="w-5/6 h-4/5 absolute left-36 top-14">
          <h1 className=" text-8xl relative left-10 top-10">{greetings[greetingIndex]}</h1>
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
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
