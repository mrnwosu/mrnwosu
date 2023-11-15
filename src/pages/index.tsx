import { type NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { api } from "../utils/api";
import { set } from "zod";

const Home: NextPage = () => {
  const greetings = ["Hello!", "¡Bojour!", "¡Hola!", "Hallo!", "¡Ola!"];
  const greetingIndexRef = useRef(0);
  const loadedProfileImageCount = useRef(0);

  useEffect(() => {
    document.querySelectorAll(".word-container").forEach((word) => {
      word.classList.remove("opacity-0");
      word.classList.add("opacity-100");
    });

    setInterval(() => {
      greetingIndexRef.current =
        (greetingIndexRef.current + 1) % greetings.length;
    }, 3000);
  }, []);

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
      <main className="flex h-screen w-screen flex-row bg-gradient-to-tr from-gray-600 to-claw_nueve">
        <div className="flex w-1/2 items-center justify-center ">
          <div className=" flex flex-col items-center justify-center gap-y-4 font-bold">
            <div className=" word-container text-7xl text-claw_siete opacity-0 transition delay-300 duration-[1500ms]">
              <p>{greetings[greetingIndexRef.current]}</p>
            </div>
            <div className="flex flex-col items-center justify-center gap-2">
              <div className=" word-container tranistion text-right text-5xl text-claw_siete opacity-0 delay-500 duration-[1500ms]">
                <p className="  ">
                  My name is
                  <span className=" text-claw_dos"> Ike Nwosu</span>
                </p>
              </div>
              <div className=" word-container opacity-0 transition delay-700 duration-[1500ms]">
                <p className="text-2xl text-claw_siete ">I does this.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-1/2 items-center justify-center ">
          <div className=" grid w-[27em] grid-cols-3 grid-rows-4 gap-2 ">
            {Array(12)
              .fill(0)
              .map((_, i) => {
                const number = i < 9 ? `00${i + 1}` : `0${i + 1}`;
                const delays = [400, 800, 1200];
                const time = delays[i % 3] ?? 400;
                const delay = `delay-[${time}ms]`;
                return (
                  <div
                    key={i}
                    className={`${delay} profile-image-container relative opacity-0 shadow-md shadow-claw_diez transition duration-[1500ms] before:bg-black `}
                  >
                    <Image
                      src={`/brokenImage1/image_part_${number}.jpg`}
                      alt="Author Image"
                      width={140}
                      height={157.89}
                      sizes="100%"
                      className="profile-image"
                      onLoad={() => {
                        loadedProfileImageCount.current++;
                        console.log({
                          currentLoaded: loadedProfileImageCount.current,
                        });
                        if (loadedProfileImageCount.current === 12) {
                          const allProfileImages = document.querySelectorAll(
                            ".profile-image-container"
                          );
                          allProfileImages.forEach((image) => {
                            image.classList.remove("opacity-0");
                            image.classList.add("opacity-100");
                          });
                        }
                      }}
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
