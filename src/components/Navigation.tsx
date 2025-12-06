"use client";

import {
  InstagramLogoIcon,
  GitHubLogoIcon,
  LinkedInLogoIcon,
  HamburgerMenuIcon,
} from "@radix-ui/react-icons";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../@/components/ui/sheet";
import { NavButton } from "../@/components/ui/navButton";
import { ContactMeForm } from "../@/components/contactMeForm";
import { elementClassToggle } from "@utils/uiHelpers";
import { useRef } from "react";
import Link from "next/link";

export function Navigation() {
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

      {/* Navigation Links - Desktop */}
      <div className="slide-in-left z-30 hidden md:flex translate-x-24 flex-row gap-2 sm:gap-4 md:gap-2 text-sm sm:text-base md:text-lg opacity-0 transition delay-1000 duration-1500 sm:mr-4 sm:mt-2 md:mr-8 md:mt-4 lg:mr-8 lg:mt-4 lg:gap-2">
        <Link href="/blog">
          <NavButton
            className="text-sm sm:text-base md:text-lg"
            variant="ghost"
            size="skinny"
          >
            Blog
          </NavButton>
        </Link>
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

      {/* Hamburger Menu - Mobile */}
      <Sheet>
        <SheetTrigger asChild>
          <NavButton
            variant="ghost"
            size="icon"
            className="slide-in-left z-30 translate-x-24 md:hidden opacity-0 transition delay-1000 duration-1500"
          >
            <HamburgerMenuIcon />
          </NavButton>
        </SheetTrigger>
        <SheetContent
          className="border-l-4 border-l-slate-500 bg-black/80 text-white w-[250px]"
          side="right"
        >
          <SheetHeader>
            <SheetTitle className="text-xl">Menu</SheetTitle>
          </SheetHeader>
          <div className="relative h-6"></div>
          <div className="flex flex-col gap-4">
            <Link href="/blog">
              <NavButton
                className="text-base text-left justify-start"
                variant="ghost"
                size="default"
              >
                Blog
              </NavButton>
            </Link>
            <Sheet>
              <SheetTrigger asChild>
                <NavButton
                  className="text-base text-left justify-start text-red-700 hover:text-red-500"
                  variant="ghost"
                  size="default"
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
        </SheetContent>
      </Sheet>
    </nav>
  );
}
