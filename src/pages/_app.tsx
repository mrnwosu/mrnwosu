import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { Analytics } from "@vercel/analytics/react";
import { ContactMeForm } from "../@/components/contactMeForm";
import {
  InstagramLogoIcon,
  GitHubLogoIcon,
  LinkedInLogoIcon,
} from "@radix-ui/react-icons";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NavButton } from "@/components/ui/navButton";
import { elementClassToggle } from "utils/uiHelpers";
import { useRef } from "react";
import { isMobile } from "react-device-detect";
import { animate } from "motion";
import Image from "next/image";
import { api } from "../utils/api";
import "../styles/globals.css";
import useAllImageLoaded from "hooks/useAllImageLoaded";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {

  useAllImageLoaded({
    handleAllImagesLoaded: handleImageLoaded,
  })

  function handleImageLoaded() {
    console.log("All images loaded");

    const loadingLeftElems = document.querySelectorAll(
      ".loading-div-half-left"
    );

    if (loadingLeftElems.length === 0) return;

    animate(".loading-div-half-left", {
      x: "-100%",
    });

    animate(".loading-div-half-right", {
      x: "100%",
    });

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
    isLoaded.current = true;
  }

  const isLoaded = useRef<boolean>(false);
  const isContactMeFormSubmitted = useRef<boolean>(false);

  function handleFormSubmit() {
    isContactMeFormSubmitted.current = true;
    if (isContactMeFormSubmitted.current) {
      elementClassToggle(
        ".sheet-form-container",
        ["opacity-100"],
        ["opacity-0"]
      );
      elementClassToggle(
        ".sheet-form-completed-container",
        ["opacity-0"],
        ["opacity-100"]
      );
    } else {
      elementClassToggle(
        ".sheet-form-container",
        ["opacity-100"],
        ["opacity-0"]
      );
      elementClassToggle(
        ".sheet-form-completed-container",
        ["opacity-0"],
        ["opacity-100"]
      );
    }
  }

  return (
    <>
      <Analytics />
      {/* Loading Overlay */}
      <div className="loading-div-container absolute flex h-full w-full flex-row overflow-hidden">
        <div className="rotating-loading-image absolute z-40 flex h-full w-full items-center justify-center font-gravitas text-sm sm:text-lg md:text-2xl lg:text-2xl transition duration-1500">
          <Image
            className="absolute z-40 animate-spin duration-10000"
            src="/loading-circle.png"
            alt="Ike Nwosu • Software Engineer"
            width={200}
            height={200}
            sizes="(max-width: 640px) 200px, (max-width: 1024px) 300px, 400px"
          />
          <p className="loading-text font-gravitas text-sm sm:text-lg md:text-2xl lg:text-2xl text-white"></p>
        </div>
        <div className="inset-0 flex h-full w-full flex-col md:flex-row lg:flex-row">
          <div className="loading-div-half-left z-30 h-1/2 w-full bg-cyan-800 transition duration-1500 ease-in-out md:h-full md:w-1/2 lg:h-full lg:w-1/2"></div>
          <div className="loading-div-half-right z-30 h-1/2 w-full bg-cyan-800 transition duration-1500 ease-in-out md:h-full md:w-1/2 lg:h-full lg:w-1/2"></div>
        </div>
      </div>
      <div className="overflow-clip text-white">
        <div className="h-screen w-screen bg-gradient-to-b">
          <nav className="absolute z-20 flex w-full justify-between bg-[#0C3049] px-3 py-2 sm:px-4 sm:py-1 md:bg-transparent md:px-8 lg:bg-transparent lg:px-24">
            {/* Social Links */}
            <div className="slide-in-right flex -translate-x-24 flex-row gap-1 sm:gap-2 opacity-0 transition delay-1000 duration-1500 sm:px-2 md:px-4 lg:mt-4 lg:px-4">
              <a
                href="https://www.linkedin.com/in/ikenwosu"
                target="_blank"
                rel="noreferrer"
              >
                <NavButton variant="ghost" size="icon">
                  <LinkedInLogoIcon />
                </NavButton>
              </a>
              <a
                href="https://github.com/mrnwosu"
                target="_blank"
                rel="noreferrer"
              >
                <NavButton variant="ghost" size="icon">
                  <GitHubLogoIcon />
                </NavButton>
              </a>
              <a
                href="https://www.instagram.com/naijapsi5"
                target="_blank"
                rel="noreferrer"
              >
                <NavButton variant="ghost" size="icon">
                  <InstagramLogoIcon />
                </NavButton>
              </a>
            </div>
            {/* Navigation Links */}
            <div className="slide-in-left z-30 flex translate-x-24 flex-row gap-2 sm:gap-4 md:gap-2 text-sm sm:text-base md:text-lg opacity-0 transition delay-1000 duration-1500 sm:mr-4 sm:mt-2 md:mr-8 md:mt-4 lg:mr-8 lg:mt-4 lg:gap-2">
              <NavButton
                className="text-sm sm:text-base md:text-lg"
                variant="ghost"
                size="skinny"
              >
                Blog
              </NavButton>
              <Sheet>
                <SheetTrigger asChild>
                  <NavButton
                    className="text-sm sm:text-base md:text-lg text-red-700 hover:text-red-500"
                    variant="ghost"
                    size="skinny"
                  >
                    Contact Me
                  </NavButton>
                </SheetTrigger>
                <SheetContent
                  className="border-l-4 border-l-slate-500 bg-black/80 text-white"
                  side="right"
                >
                  <SheetHeader>
                    <SheetTitle className="text-xl">Contact Me</SheetTitle>
                    <SheetDescription>
                      Feel free to drop me a message anytime if you have
                      questions, need advice, or just want to chat. I&apos;m
                      here to help and always open to interesting
                      conversations.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="relative h-6"></div>
                  <div className="relative">
                    {isContactMeFormSubmitted.current && (
                      <div className="sheet-form-completed-container absolute w-full opacity-0 transition">
                        <div className="flex flex-col items-center justify-center gap-3 py-8">
                          <div className="text-2xl">✓</div>
                          <p className="text-center text-lg font-semibold">Thanks for reaching out!</p>
                          <p className="text-center text-sm text-gray-400">I&apos;ll get back to you soon.</p>
                        </div>
                      </div>
                    )}
                    {!isContactMeFormSubmitted.current && (
                      <div className="sheet-form-container absolute w-full transition">
                        <ContactMeForm submiteHandler={handleFormSubmit} />
                      </div>
                    )}
                  </div>
                  <SheetFooter />
                </SheetContent>
              </Sheet>
            </div>
          </nav>
          <Component {...pageProps} />
        </div>
      </div>
    </>
  );
};

export default api.withTRPC(MyApp);
