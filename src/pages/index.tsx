import { type NextPage } from "next";
import { useEffect, useRef } from "react";
import Head from "next/head";
import Image from "next/image";
import * as programmerQuotes from "@utils/programmerQuotes.json";
import Link from "next/link";
import {
  InstagramLogoIcon,
  GitHubLogoIcon,
  LinkedInLogoIcon,
} from "@radix-ui/react-icons";

import {
  elementClassToggle,
  setAttrivuteBySelector,
  setTextForElementBySelector as setTextBySelector,
} from "../utils/uiHelpers";
import { isMobile } from "react-device-detect";
import { NavButton } from "@/components/ui/navButton";
import type { Quote } from "@models/quote";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ContactMeForm } from "@components/contactMeForm";

const Home: NextPage = () => {
  const previousQuote = useRef<Quote | null>(null);
  const currentQuote = useRef<Quote | null>(null);
  const imageLoadCount = useRef<number>(0);
  const nextQuote = useRef<Quote | null>(null);
  const loadingText = useRef<string>("Loading");
  const loadingTextInterval = useRef<NodeJS.Timer | null>(null);
  const isFirstLoad = useRef<boolean>(true);

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

    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      loadingTextInterval.current = setInterval(() => {
        if (loadingText.current.length > 9) {
          loadingText.current = "Loading";
        } else {
          loadingText.current += ".";
        }
        setTextBySelector(".loading-text", loadingText.current);
      }, 500);
    }
  }, []);

  function handleImageLoaded() {
    imageLoadCount.current += 1;
    const totalImageCount = [...document.querySelectorAll("img")]?.length;
    console.log(
      `Total Images ${totalImageCount}, Loaded Images ${imageLoadCount.current}`
    );

    if (imageLoadCount.current !== totalImageCount) return;

    const loadingLeftElems = document.querySelectorAll(
      ".loading-div-half-left"
    );

    if (loadingLeftElems.length === 0) return;

    elementClassToggle(".loading-div-half-left", ["-translate-x-full"], null);

    elementClassToggle(".loading-div-half-right", ["translate-x-full"], null);

    if (isMobile) {
      elementClassToggle(
        ".rotating-loading-image",
        ["-translate-x-full", "opacity-0", "scale-0"],
        null
      );
    } else {
      elementClassToggle(
        ".rotating-loading-image",
        ["translate-y-full", "opacity-0", "scale-0"],
        null
      );
    }

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

    elementClassToggle(".blob", ["opacity-50"], null);

    if (loadingTextInterval.current) {
      clearInterval(loadingTextInterval.current);
    }
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
        <div className=" loading-div-container absolute flex h-full w-full flex-row overflow-hidden">
          <div className=" rotating-loading-image absolute z-40 flex h-full w-full items-center justify-center font-gravitas text-2xl transition duration-1500">
            <Image
              className=" absolute z-40 animate-spin duration-10000"
              src="/loading-circle.png"
              alt="Ike Nwosu • Software Engineer"
              width={400}
              height={400}
              onLoad={handleImageLoaded}
            />
            <p className=" loading-text font-gravitas text-2xl text-white"></p>
          </div>
          <div className=" inset-0 flex h-full w-full flex-col md:flex-row lg:flex-row">
            <div className=" loading-div-half-left z-30 h-1/2 w-full bg-cyan-800 transition duration-1500 ease-in-out md:h-full md:w-1/2 lg:h-full lg:w-1/2"></div>
            <div className=" loading-div-half-right z-30 h-1/2 w-full bg-cyan-800 transition duration-1500 ease-in-out md:h-full md:w-1/2 lg:h-full lg:w-1/2"></div>
          </div>
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
        <nav className="absolute z-20 flex w-full justify-between bg-[#0C3049] py-1 px-4 md:bg-transparent md:p-0 md:px-24  lg:bg-transparent lg:p-0 lg:px-24 ">
          <div className=" slide-in-right transitionduration-1500 flex -translate-x-24 flex-row gap-2 opacity-0 delay-1000 md:px-4 lg:mt-4 lg:px-4 ">
            <a
              href="https://www.linkedin.com/in/ikenwosu"
              target="_blank"
              rel="noreferrer"
            >
              <NavButton variant={"ghost"} size="icon">
                <LinkedInLogoIcon />
              </NavButton>
            </a>
            <a
              href="https://github.com/mrnwosu"
              target="_blank"
              rel="noreferrer"
            >
              <NavButton variant={"ghost"} size="icon">
                <GitHubLogoIcon />
              </NavButton>
            </a>
            <a
              href="https://www.instagram.com/naijapsi5"
              target="_blank"
              rel="noreferrer"
            >
              <NavButton variant={"ghost"} size="icon">
                <InstagramLogoIcon />
              </NavButton>
            </a>
          </div>
          <div className=" slide-in-left z-30 flex translate-x-24 flex-row gap-6 text-lg opacity-0 transition duration-1500 delay-1000 md:mr-8 md:mt-4 md:gap-2 lg:mr-8 lg:mt-4  lg:gap-2">
            <NavButton className=" text-lg " variant={"ghost"} size={"skinny"}>
              Blog
            </NavButton>
            <Sheet>
              <SheetTrigger asChild={true}>
                <NavButton
                  className=" text-lg text-red-700 hover:text-red-500"
                  variant={"ghost"}
                  size={"skinny"}
                >
                  Contact Me
                </NavButton>
              </SheetTrigger>
              <SheetContent
                className=" border-l-4 border-l-slate-500  bg-black/80 text-white"
                side="right"
              >
                <SheetHeader>
                  <SheetTitle className=" text-xl">Contact Me</SheetTitle>
                  <SheetDescription>
                    Feel free to drop me a message anytime if you have
                    questions, need advice, or just want to chat. I'm here to
                    help and always open to interesting conversations.
                  </SheetDescription>
                </SheetHeader>
                <div className=" relative h-6"></div>
                <div className=" relative">
                  <div className=" absolute w-full">
                    
                  </div>
                  <div className=" absolute w-full">
                    <ContactMeForm />
                  </div>
                </div>
                <SheetFooter>
                  {/* Add the submit button here */}
                  {/* <Button
                    className=" bg-red-700 text-white hover:bg-red-500"
                    variant="contained"
                  >
                    Submit
                  </Button> */}
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
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
              <div className=" mt-[30rem] text-white md:w-2/3 lg:mt-28 lg:w-2/3">
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
              onLoad={handleImageLoaded}
            />
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
