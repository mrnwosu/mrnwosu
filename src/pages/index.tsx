import { type NextPage } from "next";
import { useEffect, useRef } from "react";
import Head from "next/head";
import Image from "next/image";
import * as programmerQuotes from "@utils/programmerQuotes.json";
import Link from "next/link";


import {
  setAttrivuteBySelector,
  setTextForElementBySelector as setTextBySelector,
} from "../utils/uiHelpers";
import type { Quote } from "@models/quote";

const Home: NextPage = () => {
  const previousQuote = useRef<Quote | null>(null);
  const currentQuote = useRef<Quote | null>(null);
  const nextQuote = useRef<Quote | null>(null);
  
  useEffect(() => {
    currentQuote.current = getRandomQuote();
    nextQuote.current = getRandomQuote();
    refreshQuotes();
  }, []);

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
        
        <div className=" absolute h-full w-full overflow-clip after:absolute after:h-full after:w-full after:bg-gradient-to-b after:from-white after:to-black after:opacity-50 after:mix-blend-multiply">
          <Image
            src="/dark-whatever-background.jpg"
            alt="Background Image"
            className=" scale-125 opacity-30 mix-blend-screen"
            fill={true}
          />
        </div>
        
        <div className=" z-10 flex h-full justify-center pt-20 pb-12 md:pt-36 lg:relative lg:w-1/2 lg:pt-36 ">
          <div className="h-full w-4/5 flex-col items-start text-center md:ml-64 md:text-left lg:ml-64 lg:text-left">
            {/* My Name / Title  */}
            <div className="flex flex-col gap-2">
              <div className=" word-container tranistion flex flex-col text-white">
                <div>
                  <p className=" slide-in-right -translate-x-24 font-gravitas text-6xl opacity-0 transition duration-1500 md:text-8xl lg:text-8xl">
                    Ike
                  </p>
                  <p className=" slide-in-right -translate-x-24 font-gravitas  text-6xl opacity-0 transition duration-1500 md:text-8xl lg:text-8xl">
                    Nwosu
                  </p>
                </div>
                <div className=" slide-in-right my-1 h-1 -translate-x-24 rounded-md bg-yellow-800 opacity-0 transition duration-1500 delay-200 md:w-72 lg:w-72"></div>
                <div>
                  <p className=" slide-in-right text-claw_siete text:lg -translate-x-24 opacity-0 transition duration-1500 delay-200 md:text-xl lg:text-xl">
                    Software Engineer
                  </p>
                </div>
              </div>
            </div>
            {/* Quote */}
            <div className=" relative flex h-full flex-col gap-2 ">
              <div className=" text-white md:mt-[8rem] md:w-2/3 lg:mt-28 lg:w-2/3">
                <div
                  className="quote-box-current slide-in-right -translate-x-24  text-white/80 opacity-0 transition duration-1500 delay-500 hover:text-white/100"
                  onClick={() => {
                    updateQuotes();
                  }}
                >
                  <p className=" quote-box-current-text text-center text-2xl italic md:text-left lg:text-left"></p>
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
        <div className=" absolute flex h-full w-full items-center justify-center md:relative lg:relative lg:w-1/2 ">
          <div className=" blob slide-in-left absolute h-64 w-64 translate-x-24 scale-125 rounded-full bg-[#0B548F] opacity-0 blur-3xl transition duration-1500 lg:top-36 lg:left-72"></div>
          <div className=" slide-in-left relative mt-40 aspect-[2/3] h-2/3 translate-x-24 gap-2 overflow-hidden rounded-xl p-12 opacity-0 transition-all duration-1500 md:mt-0 md:h-5/6  lg:mt-0 lg:h-5/6">
            <Image
              src="/IkeBday-5-transparent.png"
              alt="Picture of the author"
              fill={true}
            />
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
