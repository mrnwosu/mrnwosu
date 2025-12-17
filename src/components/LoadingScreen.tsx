"use client";

import { elementClassToggle, setLoadingCompleted } from "@utils/uiHelpers";
import { useRef, useEffect } from "react";
import { isMobile } from "react-device-detect";
import { animate } from "motion";
import Image from "next/image";
import useAllImageLoaded from "../hooks/useAllImageLoaded";

export function LoadingScreen() {
  const isLoaded = useRef<boolean>(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
  }, []);

  useAllImageLoaded({
    handleAllImagesLoaded: handleImageLoaded,
  });

  function handleImageLoaded() {
    console.log("All images loaded");
    document.body.style.overflow = "";

    const loadingLeftElems = document.querySelectorAll(
      ".loading-div-half-left"
    );

    if (loadingLeftElems.length === 0) return;

    void animate(".loading-div-half-left", {
      x: "-100%",
    });

    void animate(".loading-div-half-right", {
      x: "100%",
    });

    if (isMobile) {
      elementClassToggle(".rotating-loading-image", ["opacity-0"], null);
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
    elementClassToggle(".loading-div-container", ["pointer-events-none"], null);
    isLoaded.current = true;
    setLoadingCompleted(true);
  }

  return (
    <div className="loading-div-container absolute flex h-full w-full flex-row overflow-hidden">
      <div className="rotating-loading-image absolute z-40 flex h-full w-full items-center justify-center font-gravitas text-sm sm:text-lg md:text-2xl lg:text-2xl transition duration-1500">
        <Image
          className="absolute z-40 animate-spin duration-10000"
          src="/loading-circle.png"
          alt="Ike Nwosu • Software Engineer"
          width={400}
          height={400}
          sizes="(max-width: 640px) 280px, (max-width: 1024px) 350px, 400px"
        />
        <p className="loading-text font-gravitas text-sm sm:text-lg md:text-2xl lg:text-2xl text-white"></p>
      </div>
      <div className="inset-0 flex h-full w-full flex-col md:flex-row lg:flex-row">
        <div className="loading-div-half-left z-30 h-1/2 w-full bg-warm-800 transition duration-1500 ease-in-out md:h-full md:w-1/2 lg:h-full lg:w-1/2"></div>
        <div className="loading-div-half-right z-30 h-1/2 w-full bg-warm-800 transition duration-1500 ease-in-out md:h-full md:w-1/2 lg:h-full lg:w-1/2"></div>
      </div>
    </div>
  );
}
