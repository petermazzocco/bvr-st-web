"use client";
import { GetNotifiedModal } from "@/components/modals/get-notified-modal";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HeroVideo } from "@/components/utils/hero-video";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

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
      <div
        className="relative h-screen flex flex-col overflow-hidden"
        style={{
          transform: `translateY(${scrollY * 0.4}px)`,
        }}
      >
        {/* Background Video */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-cover bg-center bg-[url('/main-fallback.png')]" />
          <HeroVideo />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Grid Lines Overlay - Hide on mobile */}
        <div className="absolute inset-0 z-5 pointer-events-none hidden md:block">
          {/* Three vertical lines */}
          <div className="absolute left-1/4 top-0 bottom-0 w-[1px] bg-white/30"></div>
          <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-white/30"></div>
          <div className="absolute left-3/4 top-0 bottom-0 w-[1px] bg-white/30 lg:flex lg:flex-col lg:items-start lg:justify-center hidden">
            <p className="text-muted/50">ELEVATE.</p>
            <p className="text-muted/50">DISRUPT.</p>
            <p className="text-muted/50">INNOVATE.</p>
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
            (25—26)
          </div>
        </div>

        {/* Main content container */}
        <div className="relative z-10 flex-1 flex flex-col text-white">
          {/* Mobile: Updated layout with buttons in bottom quarter */}
          <div className="flex flex-col h-full px-4 sm:hidden">
            {/* Top section with centered content */}
            <div className="flex-1 flex flex-col items-center justify-center">
              {/* ELEVATE. DISRUPT. INNOVATE. text for mobile */}
              <div className="text-white/70 text-xs font-light tracking-[0.15em] space-y-1 mb-8 text-center">
                <p>ELEVATE.</p>
                <p>DISRUPT.</p>
                <p>INNOVATE.</p>
              </div>

              {/* Main brand text - centered */}
              <div className="text-center mb-8">
                <h1 className="text-[5rem] leading-[0.75] font-thin tracking-[-0.02em] text-background mix-blend-screen">
                  BVR ST CO
                </h1>
                <div className="text-muted text-[0.6rem] font-light tracking-[0.3em] uppercase mt-2">
                  A NEW VISION
                </div>
              </div>

              {/* About section - centered */}
              <div className="space-y-2 text-center max-w-[400px] hidden md:block">
                <div className="text-primary text-[0.6rem] font-light tracking-[0.2em] uppercase">
                  ABOUT
                </div>
                <p className="text-white text-xs font-light leading-relaxed">
                  The collective that&apos;s building the future of college
                  athletics
                </p>
              </div>
            </div>

            {/* Bottom quarter section for buttons */}
            <div className="h-1/4 flex flex-col justify-center items-center">
              <div className="flex flex-col gap-2 w-full max-w-[400px]">
                <Button
                  variant="outline"
                  asChild
                  className="group border-white/30 bg-white/5 backdrop-blur-sm hover:bg-white/10 text-white hover:text-white transition-all duration-300 h-8"
                >
                  <Link
                    href="/blog/welcome-to-bvr-st-co"
                    id="learn-more-button"
                    data-umami-event="Homepage learn more clicked"
                    className="flex items-center justify-center w-full text-[0.6rem] tracking-[0.1em] group-hover:text-primary"
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
                <h1 className="text-[5rem] leading-[0.8] md:text-[8rem] lg:text-[10rem] xl:text-[13rem] lg:leading-[0.8] font-thin tracking-[-0.02em] text-background mix-blend-screen">
                  BVR ST CO
                </h1>
                <div className="text-muted text-xs lg:text-sm font-light tracking-[0.3em] uppercase ml-2">
                  A NEW VISION
                </div>
              </div>
            </div>

            {/* Bottom right content - Desktop positioning */}
            <div className="absolute bottom-8 right-8 lg:bottom-16 lg:right-16 max-w-xs">
              <div className="mb-8 space-y-2">
                <div className="text-primary text-xs font-light tracking-[0.2em] uppercase">
                  ABOUT
                </div>
                <p className="text-white text-sm font-light leading-relaxed">
                  The collective that&apos;s building the future of college
                  athletics
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  variant="outline"
                  asChild
                  className="group border-white/30 bg-white/5 backdrop-blur-sm hover:bg-white/10 text-white hover:text-white transition-all duration-300 h-11"
                >
                  <Link
                    href="/blog/welcome-to-bvr-st-co"
                    id="learn-more-button"
                    data-umami-event="Homepage learn more clicked"
                    className="flex items-center justify-center w-full text-xs tracking-[0.1em] group-hover:text-primary"
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

      {/* Aircraft Systems Accordion Section - Normal flow */}
      <section className="bg-white py-16 px-6 relative z-20">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-thin tracking-[-0.02em] text-gray-900 mb-4">
              WHO WE ARE
            </h2>
            <p className="text-muted-foreground text-sm font-light tracking-[0.1em]">
              OPERATIONAL STATUS OVERVIEW
            </p>
          </div>

          <Accordion
            type="single"
            collapsible
            defaultValue="item-1"
            className="w-full"
          >
            <AccordionItem value="item-1" className="border-b border-gray-200">
              <AccordionTrigger className="py-6 px-6 text-left hover:no-underline hover:bg-gray-50 [&[data-state=open]>svg]:rotate-90">
                <span className="text-lg font-medium text-gray-900 tracking-wide">
                  01 ELEVATING
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <div className="pt-4 space-y-4">
                  <p className="text-gray-700 font-medium">
                    Elevating Student-Athlete Opportunities Through Innovation
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    We&apos;re elevating Oregon State athletics by leveraging
                    our greatest competitive advantage: the alumni who built
                    Silicon Valley. From the engineers behind today&apos;s AI
                    processors to the entrepreneurs who transformed startups
                    into tech giants, Beaver Nation has shaped the future. Now
                    we&apos;re channeling that innovation directly into
                    supporting our student-athletes through authentic NIL
                    partnerships and cutting-edge revenue streams.
                  </p>
                  <div className="pt-2">
                    <p className="text-sm text-gray-500 font-light tracking-wide uppercase">
                      Real NIL Opportunities • Genuine Partnerships •
                      Sustainable Growth
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border-b border-gray-200">
              <AccordionTrigger className="py-6 px-6 text-left hover:no-underline hover:bg-gray-50 [&[data-state=open]>svg]:rotate-90">
                <span className="text-lg font-medium text-gray-900 tracking-wide">
                  02 DISRUPTING
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <div className="pt-4 space-y-4">
                  <p className="text-gray-700 font-medium">
                    Disrupting Traditional Collective Models
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    While major programs burn through millions via outdated
                    fundraising models, we&apos;re operating like a tech
                    startup. Instead of asking for donations, we&apos;re
                    creating products and services that provide real value to
                    fans while generating sustainable revenue. Every purchase
                    from our offerings supports authentic NIL opportunities for
                    student-athletes across every sport—exactly as NIL was
                    intended to work.
                  </p>
                  <div className="pt-2">
                    <p className="text-sm text-gray-500 font-light tracking-wide uppercase">
                      Value Creation • Product Innovation • Market Disruption
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border-b border-gray-200">
              <AccordionTrigger className="py-6 px-6 text-left hover:no-underline hover:bg-gray-50 [&[data-state=open]>svg]:rotate-90">
                <span className="text-lg font-medium text-gray-900 tracking-wide">
                  03 INNOVATING
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <div className="pt-4 space-y-4">
                  <p className="text-gray-700 font-medium">
                    Innovating The Future of College Athletics
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    We&apos;re architecting a new paradigm where Silicon Valley
                    mindset meets Beaver Nation heritage. Through innovative
                    programs and strategic partnerships, every Oregon State
                    student-athlete will have opportunities to earn income
                    through their Name, Image, and Likeness.
                  </p>
                  <div className="pt-2">
                    <p className="text-sm text-gray-500 font-light tracking-wide uppercase">
                      Affiliate Program • Brand Partnerships • Sustainable
                      Impact
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
