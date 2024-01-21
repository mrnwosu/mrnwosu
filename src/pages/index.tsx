import { type NextPage } from "next";
import { useEffect, useRef } from "react";
import Head from "next/head";
import Image from "next/image";

import { TopIconLink } from "../components/Icons";
import {
  multipleElementAnimation,
  singleElementAnimation,
} from "../utils/uiHelpers";
import { linkIcons } from "../utils/linkIcons";

const Home: NextPage = () => {
  const loadedImageCount = useRef(0);

  useEffect(() => {
    multipleElementAnimation(".word-container", [
      {
        remove: "opacity-0",
        add: "opacity-100",
      },
    ]);

    multipleElementAnimation(".icon-wrapper", [
      { remove: "opacity-0", add: "opacity-100" },
      { remove: "translate-y-4", add: "translate-y-0" },
    ]);
  }, []);

  return (
    <>
      <Head>
        <title>Mr. Nwosu</title>
        <meta
          name="description"
          content="Personal/Professional Website for Ike Nwosu"
        />
      </Head>
      <main className="relative flex h-screen w-screen flex-col bg-black md:flex-col lg:flex-row">
        <div className=" absolute h-full w-full overflow-clip after:absolute after:h-full after:w-full after:bg-gradient-to-b after:from-white after:to-black after:opacity-50 after:mix-blend-multiply">
          <Image
            src="/dark-whatever-background.jpg"
            alt="Background Image"
            className=" h-full w-full translate-x-56 scale-110 object-cover object-center opacity-30 mix-blend-screen transition duration-[10000ms] ease-in-out hover:translate-x-0"
            fill={true}
            onLoad={() => {
              loadedImageCount.current += 1;
            }}
          />
        </div>
        <nav className="absolute z-50 flex w-full justify-between px-24 ">
          <div className=" mt-4 flex flex-row gap-1 px-4">
            {linkIcons.map((l, i) => {
              const delayClass = `delay-[${(i + 1) * 500}ms]`;
              return (
                <div
                  className={` icon-wrapper translate-y-4 opacity-0 transition ${delayClass} duration-[1500ms] ease-out `}
                  key={`${i}-${l.description}`}
                >
                  <TopIconLink
                    key={i}
                    href={l.href}
                    icon={l.icon}
                    description={l.description}
                    size={l.size}
                  />
                </div>
              );
            })}
          </div>
          <div className=" z-50 mr-8 mt-4 flex flex-row gap-6  text-lg">
            <p className=" text-white/70 hover:text-white/100 transition">Blog</p>
            <p className=" text-white/70 hover:text-white/100 transition">About this site</p>
            <p className=" text-red-700/70 hover:text-red-700 transition">Contact Me</p>
          </div>
        </nav>
        <div className=" absolute z-10 flex h-full w-full flex-col items-center pt-36 pb-12 lg:relative lg:w-1/2 ">
          <div className="flex flex-col gap-2">
            <div className=" word-container tranistion flex w-4/5 flex-col text-white opacity-0 delay-500 duration-[1500ms]">
              <div>
                <p className=" font-gravitas text-8xl">Ike</p>
                <p className=" font-gravitas  text-8xl">Nwosu</p>
              </div>
              <div className=" my-1 h-1 w-72 bg-yellow-800"></div>
              <div>
                <p className=" text-2xl text-claw_siete">Software Engineer</p>
              </div>
            </div>
          </div>
        </div>
        <div className=" relative flex items-center justify-center md:w-full lg:w-1/2 ">
          <div className=" absolute h-64 w-64 scale-125 rounded-full bg-[#0B548F] opacity-50 blur-3xl lg:top-36 lg:left-72"></div>
          <div className=" relative aspect-[2/3] h-5/6 gap-2 overflow-hidden rounded-xl p-12">
            <Image
              src="/IkeBday-5-transparent.png"
              alt="Picture of the author"
              fill={true}
              onLoad={() => {
                loadedImageCount.current += 1;
              }}
            />
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
