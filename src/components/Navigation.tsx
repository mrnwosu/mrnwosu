"use client";

import {
  InstagramLogoIcon,
  GitHubLogoIcon,
  LinkedInLogoIcon,
  HamburgerMenuIcon,
} from "@radix-ui/react-icons";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../@/components/ui/sheet";
import { NavButton } from "../@/components/ui/navButton";
import { ContactSheet } from "./ContactSheet";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { isLoadingCompleted } from "@utils/uiHelpers";

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  // If loading already completed (navigating back), show elements immediately
  const [skipLoadingAnimation] = useState(() => isLoadingCompleted());

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 z-20 flex w-full justify-between px-3 py-2 sm:px-4 sm:py-1 md:px-8 lg:px-24 transition-all duration-300 ${isScrolled ? "bg-[#422C19]/10" : ""}`}>
      {/* Social Links */}
      <div className={`slide-in-right flex flex-row gap-1 sm:gap-2 transition delay-1000 duration-1500 sm:px-2 md:px-4 lg:mt-4 lg:px-4 ${skipLoadingAnimation ? "" : "-translate-x-24 opacity-0"}`}>
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
      <div className={`slide-in-left z-30 hidden md:flex flex-row gap-2 sm:gap-4 md:gap-2 text-sm sm:text-base md:text-lg transition delay-1000 duration-1500 sm:mr-4 sm:mt-2 md:mr-8 md:mt-4 lg:mr-8 lg:mt-4 lg:gap-2 ${skipLoadingAnimation ? "" : "translate-x-24 opacity-0"}`}>
        <Link
          href="/"
          className={`transition-opacity duration-300 ${isHome ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        >
          <NavButton
            className="text-sm sm:text-base md:text-lg"
            variant="ghost"
            size="skinny"
          >
            Home
          </NavButton>
        </Link>
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
              className="text-sm sm:text-base md:text-lg text-red-500 hover:text-red-400"
              variant="ghost"
              size="skinny"
            >
              Contact Me
            </NavButton>
          </SheetTrigger>
          <ContactSheet />
        </Sheet>
      </div>

      {/* Hamburger Menu - Mobile */}
      <Sheet>
        <SheetTrigger asChild>
          <NavButton
            variant="ghost"
            size="icon"
            className={`slide-in-left z-30 md:hidden transition delay-1000 duration-1500 ${skipLoadingAnimation ? "" : "translate-x-24 opacity-0"}`}
          >
            <HamburgerMenuIcon />
          </NavButton>
        </SheetTrigger>
        <SheetContent
          className="border-l-2 border-l-warm-600 bg-warm-900/95 backdrop-blur-sm text-warm-100 w-[250px]"
          side="right"
        >
          <SheetHeader>
            <SheetTitle className="font-gravitas text-xl text-warm-100">Menu</SheetTitle>
          </SheetHeader>
          <div className="relative h-6"></div>
          <div className="flex flex-col gap-4">
            <SheetClose asChild>
              <Link
                href="/"
                className={`transition-opacity duration-300 ${isHome ? "opacity-0 pointer-events-none hidden" : "opacity-100"}`}
              >
                <NavButton
                  className="text-base text-left justify-start text-warm-100 hover:text-warm-300"
                  variant="ghost"
                  size="default"
                >
                  Home
                </NavButton>
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link href="/blog">
                <NavButton
                  className="text-base text-left justify-start text-warm-100 hover:text-warm-300"
                  variant="ghost"
                  size="default"
                >
                  Blog
                </NavButton>
              </Link>
            </SheetClose>
            <Sheet>
              <SheetTrigger asChild>
                <NavButton
                  className="text-base text-left justify-start text-red-500 hover:text-red-400"
                  variant="ghost"
                  size="default"
                >
                  Contact Me
                </NavButton>
              </SheetTrigger>
              <ContactSheet />
            </Sheet>
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
}
