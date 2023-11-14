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
    const images = document.querySelectorAll(".profile-images");
    images.forEach((image) => {
      image.addEventListener("DOMContentLoaded", (s) => {
        image.classList.remove("opacity-0");
        image.classList.add("opacity-100");
      });
    });
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
      <main className="flex h-screen w-screen flex-row bg-gradient-to-r from-claw_ocho to-claw_nueve">
        <div className="flex w-1/2 items-center justify-center ">
          <div className=" flex flex-col items-center justify-center gap-y-4">
            <div className=" text-7xl font-bold text-white">
              {greetings[greetingIndex]}
            </div>
            <div className=" text-5xl font-bold text-claw_sies flex-grow">
              My name is{" "}
              <span className=" text-7xl text-claw_dos">Ike Nwosu</span>
            </div>
            <div className=" text-2xl font-bold text-claw_sies">
              I does this.
            </div>
          </div>
        </div>
        <div className="flex w-1/2 items-center justify-center ">
          <div className=" grid w-[27em] grid-cols-3 grid-rows-4 gap-2 ">
            {Array(12)
              .fill(0)
              .map((_, i) => {
                const number = i < 9 ? `00${i + 1}` : `0${i + 1}`;
                return (
                  <div
                    key={i}
                    className=" profile-images relative shadow-md shadow-claw_diez before:absolute before:inset-0 before:-z-10 before:h-full before:w-full before:scale-125 before:bg-black "
                  >
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
