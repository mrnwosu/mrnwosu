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
  const loadedProfileImageCount = useRef(0);

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
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen w-screen flex-row bg-gradient-to-tr from-gray-600 to-claw_nueve">
        <div className="flex items-center justify-center sm:w-1/2 md:w-1/2 lg:w-1/2 ">
          <div className=" absolute left-12 top-12 h-96 w-96 animate-blob_move rounded-full bg-orange-400 blur-2xl opacity-40  mix-blend-multiply filter"></div>
          <div className=" absolute bottom-12 left-80 h-96 w-96 animate-blob_move rounded-full bg-claw_siete  opacity-50 mix-blend-multiply blur-2xl filter delay-1000"></div>
          <div className=" flex flex-col items-center justify-center gap-y-4 font-bold">
            <div className=" word-container text-7xl text-claw_siete opacity-0 transition delay-300 duration-[1500ms]">
              <p>Hello!</p>
            </div>
            <div className="flex flex-col items-center justify-center gap-2">
              <div className=" word-container tranistion text-right text-5xl text-claw_siete opacity-0 delay-500 duration-[1500ms]">
                <p className="  ">
                  My name is
                  <span className=" text-claw_dos"> Ike Nwosu</span>
                </p>
              </div>
              <div className=" word-container opacity-0 transition delay-700 duration-[1500ms]">
                <p className="text-2xl text-claw_siete ">Software Engineer</p>
              </div>
              <div className="mt-8 flex flex-row gap-8 px-4">
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
