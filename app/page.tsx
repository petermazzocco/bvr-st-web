"use client";

import { GetNotifiedModal } from "@/components/modals/get-notified-modal";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

export default function Page() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Hero Section with Parallax Effect */}
      <div className="relative h-screen flex flex-col overflow-hidden">
        {/* Background Video */}
        <div
          className="absolute inset-0"
          style={{
            transform: `translateY(${scrollY * 0.4}px)`,
          }}
        >
          <div className="absolute inset-0 bg-cover bg-center bg-[url('/main-fallback.jpg')]" />

          <div className="absolute inset-0 bg-black/30" />
        </div>
        {/* Grid Lines Overlay - Hide on mobile */}
        <div className="absolute inset-0 z-5 pointer-events-none hidden md:block">
          {/* Three vertical lines */}
          <div className="absolute left-1/4 top-0 bottom-0 w-[1px] bg-white/30"></div>
          <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-white/30"></div>
          <div className="absolute left-3/4 top-0 bottom-0 w-[1px] bg-white/30 lg:flex lg:flex-col lg:items-start lg:justify-center hidden">
            <p className="text-primary/70">ELEVATE.</p>
            <p className="text-primary/70">DISRUPT.</p>
            <p className="text-primary/70 ">INNOVATE.</p>
          </div>
        </div>

        {/* Plus Icons - Responsive positioning */}
        <div className="absolute inset-0 z-5 pointer-events-none text-white text-xl sm:text-2xl lg:text-3xl">
          {/* Top Row */}
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 font-thin">
            +
          </div>
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 sm:top-6 font-thin">
            +
          </div>
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 font-thin">
            +
          </div>

          {/* Bottom Row */}
          <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 font-thin">
            +
          </div>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 sm:bottom-6 font-thin">
            +
          </div>
          <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 font-thin">
            +
          </div>
        </div>

        {/* Top corner text - Responsive positioning */}
        <div className="absolute top-4 right-4 sm:top-8 sm:right-24 z-20">
          <div className="text-white/80 text-xs sm:text-sm font-light tracking-[0.2em] border border-white/20 px-2 py-1 sm:px-3 sm:py-1.5 backdrop-blur-xl">
            (v1.0.6)
          </div>
        </div>

        {/* Main content container */}
        <div className="relative z-10 flex-1 flex flex-col text-white">
          {/* Mobile: Updated layout with buttons in bottom quarter */}
          <div className="flex flex-col h-full px-4 sm:hidden">
            {/* Top section with centered content */}
            <div className="flex-1 flex flex-col items-center justify-center">
              {/* ELEVATE. DISRUPT. INNOVATE. text for mobile */}
              <div className="text-primary/70 text-sm font-light tracking-[0.15em] space-y-1 mb-8 text-center">
                <p>ELEVATE.</p>
                <p>DISRUPT.</p>
                <p>INNOVATE.</p>
              </div>

              {/* Main brand text - centered */}
              <div className="text-center mb-8">
                <h1 className="text-[5rem] leading-[0.75] font-thin tracking-[-0.02em] text-background mix-blend-screen">
                  BVR ST STUDIO
                </h1>
                <div className="text-muted text-sm font-base tracking-[0.3em] uppercase mt-2">
                  THE FUTURE OF COLLEGE ATHLETICS
                </div>
              </div>
            </div>

            {/* Bottom quarter section for buttons */}
            <div className="h-1/4 flex flex-col justify-center items-center pb-[25vh]">
              <div className="flex flex-col gap-2 w-full max-w-[400px]">
                <div className="space-y-2 text-left w-fit">
                  <div className="text-primary text-xs font-bold drop-shadow-sm drop-shadow-black flex items-center tracking-[0.2em] uppercase">
                    <ChevronRight className="mr-1" size={16} /> ABOUT
                  </div>
                  <p className="text-white text-xs font-light leading-relaxed">
                    The innovative studio that&apos;s building the at Oregon
                    State.
                  </p>
                </div>
                <Button
                  variant="outline"
                  asChild
                  className="group border-white/30 bg-white/30 backdrop-blur-sm hover:bg-primary/30 text-white hover:text-white transition-all duration-300 h-8"
                >
                  <Link
                    href="/about"
                    id="learn-more-button"
                    data-umami-event="Homepage learn more clicked"
                    className="flex items-center justify-center w-full text-[0.6rem] tracking-[0.1em] group-hover:text-primary"
                    prefetch
                  >
                    <span className="transition-transform group-hover:translate-x-0.5 group-hover:text-primary group-hover:translate-y-[-0.125rem]">
                      LEARN MORE
                    </span>
                    <ArrowUpRight
                      className="-me-1 ms-2 opacity-60 group-hover:opacity-100 group-hover:text-primary transition-transform group-hover:translate-x-0.5 group-hover:translate-y-[-0.125rem]"
                      size={12}
                      aria-hidden="true"
                    />
                  </Link>
                </Button>
                <div className="h-10">
                  <GetNotifiedModal />
                </div>
              </div>
            </div>
          </div>

          {/* Desktop/Tablet: Original absolute positioning layout */}
          <div className="hidden sm:block">
            {/* Large brand text - Desktop positioning */}
            <div className="absolute bottom-24 left-8 md:bottom-32 md:left-10 lg:bottom-16 lg:left-10">
              <div className="space-y-4">
                <h1 className="text-[4rem] leading-[0.8] md:text-[6rem] lg:text-[7rem] xl:text-[9rem] lg:leading-[0.8] font-thin tracking-[-0.01em] text-background mix-blend-screen">
                  BVR ST STUDIO
                </h1>
                <div className="text-muted text-xs lg:text-sm font-base drop-shadow-sm drop-shadow-black tracking-[0.3em] uppercase ml-2">
                  THE FUTURE OF COLLEGE ATHLETICS
                </div>
              </div>
            </div>

            {/* Bottom right content - Desktop positioning */}
            <div className="absolute bottom-8 right-8 lg:bottom-16 lg:right-12 max-w-xs">
              <div className="mb-8 space-y-2">
                <div className="text-primary text-xs font-bold drop-shadow-sm drop-shadow-black flex items-center tracking-[0.2em] uppercase">
                  <ChevronRight className="mr-1" size={16} /> ABOUT
                </div>
                <p className="text-white text-sm font-light leading-relaxed">
                  The innovative studio that&apos;s building the future of
                  college athletics.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  variant="outline"
                  asChild
                  className="group border-white/30 bg-white/30 backdrop-blur-sm hover:bg-white/40 text-white hover:text-white transition-all duration-300 h-11"
                >
                  <Link
                    href="/about"
                    id="learn-more-button"
                    data-umami-event="Homepage learn more clicked"
                    className="flex items-center justify-center w-full text-xs tracking-[0.1em] group-hover:text-primary"
                    prefetch
                  >
                    <span className="transition-transform group-hover:translate-x-0.5 group-hover:text-primary group-hover:translate-y-[-0.125rem]">
                      LEARN MORE
                    </span>
                    <ArrowUpRight
                      className="-me-1 ms-2 opacity-60 group-hover:opacity-100 group-hover:text-primary transition-transform group-hover:translate-x-0.5 group-hover:translate-y-[-0.125rem]"
                      size={12}
                      aria-hidden="true"
                    />
                  </Link>
                </Button>
                <div className="h-11">
                  <GetNotifiedModal />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Partners */}
      <section className="bg-background py-10 px-0 sm:px-6 relative z-20 flex items-center justify-center">
        <div className="w-full mx-10 max-w-4xl">
          <div className="flex flex-col items-center justify-center gap-2 text-center">
            <Image
              src="/assets/inception.svg"
              alt="NVIDIA Inception Program"
              width={600}
              height={200}
              className="w-full max-w-md"
            />
            <p className="text-muted-foreground text-lg font-light tracking-[0.1em]">
              We are proudly part of the NVIDIA Inception Program
            </p>
          </div>
        </div>
      </section>
      <Separator className="mx-auto container" />
      {/* Aircraft Systems Accordion Section - Normal flow */}
      <section className="bg-background py-16 px-0 sm:px-6 relative z-20 flex items-center ">
        <div className="w-full mx-10">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-thin tracking-[-0.02em] text-gray-900 mb-4">
              WHO WE ARE
            </h2>
            <p className="text-muted-foreground text-sm font-light tracking-[0.1em]">
              STUDIO OPERATIONAL OVERVIEW
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-b border-gray-200">
              <AccordionTrigger className="py-6 text-left hover:underline [&[data-state=open]>svg]:rotate-90 [&[data-state=open]>span]:text-primary">
                <span className="text-lg font-medium text-gray-900 tracking-wide">
                  01 STRATEGIC PARTNERSHIPS
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <div className="pt-4 space-y-4">
                  <p className="text-gray-700 font-medium uppercase">
                    Strategic Partnerships
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    By aligning with NVIDIA through the Inception Program, we
                    serve as the bridge connecting world-class technology
                    partners with collegiate athletics programs, ensuring our athletic
                    programs have access to industry-leading innovation.
                  </p>
                  <div className="pt-2">
                    <p className="text-sm text-gray-500 font-light tracking-wide uppercase">
                      Industry Collaboration • Technology Integration •
                      Competitive Advantage
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border-b border-gray-200">
              <AccordionTrigger className="py-6 text-left hover:underline [&[data-state=open]>svg]:rotate-90 [&[data-state=open]>span]:text-primary">
                <span className="text-lg font-medium text-gray-900 tracking-wide">
                  02 STUDENT DEVELOPMENT
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <div className="pt-4 space-y-4">
                  <p className="text-gray-700 font-medium uppercase">
                    Student Development
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    We provide genuine, hands-on opportunities for collegiate
                    student-athletes and students to gain real-world experience developing
                    products and services that push athletics further. Students
                    don&apos;t just learn—they build solutions that directly
                    impact outcomes.
                  </p>
                  <div className="pt-2">
                    <p className="text-sm text-gray-500 font-light tracking-wide uppercase">
                      Real-World Experience • Product Development • Career
                      Preparation
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border-b border-gray-200">
              <AccordionTrigger className="py-6 text-left hover:underline  [&[data-state=open]>svg]:rotate-90 [&[data-state=open]>span]:text-primary">
                <span className="text-lg font-medium text-gray-900 tracking-wide">
                  03 SCALABLE INNOVATION
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <div className="pt-4 space-y-4">
                  <p className="text-gray-700 font-medium uppercase">
                    Scalable Innovation
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    When we create successful products and services internally,
                    we don&apos;t keep them to ourselves. We commercialize
                    proven solutions and offer them to other universities and
                    athletic programs, generating revenue while advancing
                    industries broadly.
                  </p>
                  <div className="pt-2">
                    <p className="text-sm text-gray-500 font-light tracking-wide uppercase">
                      Commercialization • Revenue Generation • Industry Impact
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </>
  );
}
