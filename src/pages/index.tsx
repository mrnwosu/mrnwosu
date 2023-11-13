import { type NextPage } from "next";
import { useEffect, useState } from "react";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { api } from "../utils/api";

const Home: NextPage = () => {
  const greetings = ["Hello!", "¡Bojour!", "¡Hola!", "Hallo!", "¡Ola!"];
  const [greetingIndex, setIndex] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setIndex((greetingIndex + 1) % 5);
    }, 1000);
  }, [greetingIndex]);

  // const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Head>
        <title>Mr. Nwosu</title>
        <meta
          name="description"
          content="Personal/Professional Website for Ike Nwosu"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen flex-row">
        {/* <div className=" bg-black opacity-30 relative w-screen h-5/6 overflow-hidden">
          <video autoPlay muted loop src="./promo.mp4" className=" object-cover absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10"></video>
        </div> */}
        <div className=" w-1/3 bg-slate-500"></div>
        <div className=" w-2/3 bg-slate-900">
          <div className=" grid w-[27em] grid-cols-3 grid-rows-4 gap-2 ">
            {Array(12)
              .fill(0)
              .map((_, i) => {
                const number = i < 9 ? `00${i + 1}` : `0${i + 1}`;
                return (
                  <div key={i} className=" overflow-hidden">
                    <Image
                      src={`/brokenImage1/image_part_${number}.jpg`}
                      alt="Author Image"
                      width={140}
                      height={157.89}
                      sizes="100%"
                      className="t"
                    />
                  </div>
                );
              })}
          </div>
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
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <div className="flex h-1/2 flex-col items-center justify-center"></div>
  );
};
