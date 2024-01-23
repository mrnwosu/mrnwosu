import { type NextPage } from "next";
import { useEffect, useRef } from "react";
import Head from "next/head";
import Image from "next/image";
import * as programmerQuotes from "../utils/programmerQuotes.json";

import { TopIconLink } from "../components/Icons";
import { linkIcons } from "../utils/linkIcons";
import Link from "next/link";
import { Quote } from "../models/quote";
import {
  elementClassToggle,
  setAttrivuteBySelector,
  setTextForElementBySelector as setTextBySelector,
} from "../utils/uiHelpers";

const Home: NextPage = () => {
  const loadedImageCount = useRef(0);
  const previousQuote = useRef<Quote | null>(null);
  const currentQuote = useRef<Quote | null>(null);
  const imageLoadCount = useRef<number>(0);
  const nextQuote = useRef<Quote | null>(null);

  const eventualClasses = [
    "-translate-x-full",
    "translate-x-full",
    "translate-x-24",
    "-translate-x-24",
    "opacity-50",
    "opacity-0",
    "translate-y-full",
    "scale-0",
  ];

  useEffect(() => {
    currentQuote.current = getRandomQuote();
    nextQuote.current = getRandomQuote();
    refreshQuotes();
  }, []);

  function handleImageLoaded() {
    imageLoadCount.current += 1;
    const totalImageCount = [...document.querySelectorAll("img")]?.length;
    console.log(
      `Total Images ${totalImageCount}, Loaded Images ${imageLoadCount.current}`
    );

    if (imageLoadCount.current !== totalImageCount) return;

    elementClassToggle(".loading-div-half-left", ["-translate-x-full"], null);

    elementClassToggle(".loading-div-half-right", ["translate-x-full"], null);

    elementClassToggle(".slide-in-right", null, [
      "-translate-x-24",
      "opacity-0",
      "duration-1000",
    ]);

    elementClassToggle(".slide-in-left", null, [
      "translate-x-24",
      "opacity-0",
      "duration-1000",
    ]);

    elementClassToggle(
      ".slide-out-down",
      ["translate-y-full", "opacity-0", "scale-0"],
      null
    );

    elementClassToggle(".blob", ["opacity-50"], null);
  }

  function getRandomQuote(): Quote {
    const quotes = programmerQuotes;
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex] as Quote;
  }

  function updateQuotes() {
    if (!previousQuote.current) {
      currentQuote.current = previousQuote.current;
    }
    currentQuote.current = nextQuote.current;
    nextQuote.current = getRandomQuote();
    refreshQuotes();
  }

  function refreshQuotes() {
    setTextBySelector(
      ".quote-box-current-text",
      currentQuote.current?.text ?? ""
    );
    setAttrivuteBySelector(
      ".quote-box-current-source",
      "href",
      currentQuote.current?.sourceUrl ?? ""
    );
  }

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
        {/* Loading Stuff */}
        <div className=" absolute loading-div-container flex flex-row overflow-hidden h-full w-full">
          <div className=" slide-out-down absolute z-40 flex h-full w-full items-center justify-center transition duration-1500">
            <p className=" font-gravitas text-2xl text-white">Loading...</p>
          </div>
          <div className=" left-0 top-0 loading-div-half-left absolute z-30 h-full w-1/2 bg-cyan-800 transition duration-[1500ms] ease-in-out"></div>
          <div className=" right-0 top-0 loading-div-half-right absolute z-30 h-full w-1/2 bg-cyan-800 transition duration-[1500ms] ease-in-out"></div>
        </div>
        <div className=" absolute h-full w-full overflow-clip after:absolute after:h-full after:w-full after:bg-gradient-to-b after:from-white after:to-black after:opacity-50 after:mix-blend-multiply">
          <Image
            src="/dark-whatever-background.jpg"
            alt="Background Image"
            className=" scale-125 opacity-30 mix-blend-screen"
            fill={true}
            onLoad={handleImageLoaded}
          />
        </div>
        <nav className="absolute z-20 flex w-full  justify-between px-24 ">
          <div className=" slide-in-right flex -translate-x-24  flex-row  gap-1 px-4 opacity-0 transition delay-1000 duration-1500">
            {linkIcons.map((l, i) => {
              const delayClass = `delay-[${(i + 1) * 500}ms]`;
              return (
                <div
                  className={` icon-wrapper translate-y-4 transition ${delayClass} duration-[1500ms] ease-out `}
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
          <div className=" slide-in-left z-30 mr-8 mt-4 flex translate-x-24 flex-row gap-6 text-lg opacity-0 transition delay-1000  duration-1500">
            <p className=" text-white/70 transition hover:text-white/100">
              Blog
            </p>
            <p className=" text-white/70 transition hover:text-white/100">
              About this site
            </p>
            <p className=" text-red-700/70 transition hover:text-red-700">
              Contact Me
            </p>
          </div>
        </nav>
        <div className=" z-10 flex h-full justify-center  pt-36 pb-12 lg:relative lg:w-1/2 ">
          <div className="ml-64 h-full w-4/5 flex-col items-start">
            {/* My Name / Title  */}
            <div className="flex flex-col gap-2">
              <div className=" word-container tranistion flex flex-col text-white">
                <div>
                  <p className=" slide-in-right -translate-x-24 font-gravitas text-8xl opacity-0 transition duration-1500">
                    Ike
                  </p>
                  <p className=" slide-in-right -translate-x-24 font-gravitas text-8xl opacity-0 transition duration-1500">
                    Nwosu
                  </p>
                </div>
                <div className=" slide-in-right my-1 h-1 w-72 -translate-x-24 rounded-md bg-yellow-800 opacity-0 transition delay-200 duration-1500"></div>
                <div>
                  <p className=" slide-in-right -translate-x-24 text-xl text-claw_siete opacity-0 transition delay-200 duration-1500">
                    Software Engineer
                  </p>
                </div>
              </div>
            </div>
            <div className=" grow"></div>
            {/* Quote */}
            <div className=" mt-12 flex flex-col gap-2">
              <div className=" w-2/3 text-white">
                <div
                  className="quote-box-current slide-in-right -translate-x-24  text-white/80 opacity-0 transition delay-500 duration-1500 hover:text-white/100"
                  onClick={() => {
                    updateQuotes();
                  }}
                >
                  <p className=" quote-box-current-text text-2xl italic"></p>
                  <p>
                    <span className=" italic">~ </span>
                    <span className="italic underline transition duration-75 hover:text-red-700">
                      <Link
                        href={"#"}
                        className="quote-box-current-source"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        Source
                      </Link>
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className=" relative flex items-center justify-center md:w-full lg:w-1/2 ">
          <div className=" blob slide-in-left absolute h-64 w-64 translate-x-24 scale-125 rounded-full bg-[#0B548F] opacity-0 blur-3xl transition duration-[1500ms] lg:top-36 lg:left-72"></div>
          <div className=" slide-in-left relative aspect-[2/3] h-5/6 translate-x-24 gap-2 overflow-hidden rounded-xl p-12  opacity-0  transition-all duration-[1500ms]">
            <Image
              src="/IkeBday-5-transparent.png"
              alt="Picture of the author"
              fill={true}
              onLoad={handleImageLoaded}
            />
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
