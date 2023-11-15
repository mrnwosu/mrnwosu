import { type NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { api } from "../utils/api";

import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHub from "@mui/icons-material/GitHub";
import { TopIconLink } from "../components/Icons";
import type { OverridableComponent } from "@mui/material/OverridableComponent";
import type { SvgIconTypeMap } from "@mui/material";

type TopLinkProps = {
  href: string;
  icon: OverridableComponent<SvgIconTypeMap> & { muiName: string };
  description: string;
  size: number;
};

const Home: NextPage = () => {
  const loadedProfileImageCount = useRef(0);

  const thangs: TopLinkProps[] = [
    {
      href: "https://github.com/mrnwosu",
      icon: GitHub,
      description: "",
      size: 56,
    },
    {
      href: "https://www.linkedin.com/in/ikenwosu/",
      icon: LinkedInIcon,
      description: "",
      size: 56,
    },
    {
      href: "https://www.instagram.com/naijapsi5/",
      icon: InstagramIcon,
      description: "",
      size: 56,
    },
  ];

  useEffect(() => {
    document.querySelectorAll(".word-container").forEach((word) => {
      word.classList.remove("opacity-0");
      word.classList.add("opacity-100");
    });

    const icons = document.querySelector(".icons");
    console.log({ icons })
    icons?.classList.remove("opacity-0");
    icons?.classList.add("opacity-100");

    icons?.classList.remove("translate-y-4");

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
                <p className="text-2xl text-claw_siete ">I does this.</p>
              </div>
              <div className=" icons mt-8 flex h-12 flex-row gap-8 px-4 opacity-0 transition delay-1000 ease-out translate-y-4 duration-[1500ms]">
                {thangs.map((l, i) => {
                  return (
                    <TopIconLink
                      key={i}
                      href={l.href}
                      icon={l.icon}
                      description={l.description}
                      size={l.size}
                    />
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
