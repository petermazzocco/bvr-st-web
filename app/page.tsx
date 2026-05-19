import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

export default function Page() {
  return (
    <>
      <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6 text-black">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10 w-full max-w-3xl mx-auto text-center">
          <div className="text-primary text-xs font-bold flex items-center justify-center tracking-[0.25em] uppercase mb-6">
            <ChevronRight className="mr-1" size={16} /> Now Live
          </div>

          <Image
            src="/assets/scout-on-black.svg"
            alt="Scout"
            width={200}
            height={2}
            priority
            className="mx-auto mb-10 h-28 w-28 sm:h-36 sm:w-36 rounded-2xl shadow-lg"
          />

          <h1 className="text-[3rem] sm:text-[5rem] lg:text-[6.5rem] leading-[0.85] font-thin tracking-[-0.02em] mb-6 text-foreground">
            THE SCOUT
            <br />
            PROGRAM
          </h1>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Button
              variant="outline"
              asChild
              className="group border-primary/30 bg-foreground backdrop-blur-sm hover:bg-foreground/70 text-background hover:text-background transition-all duration-300 h-11 px-8"
            >
              <Link
                href="/scout"
                id="scout-program-button"
                data-umami-event="Homepage Scout Program clicked"
                className="flex items-center justify-center text-xs tracking-[0.15em] uppercase group-hover:text-primary"
                prefetch
              >
                <span>Learn More</span>
                <ArrowUpRight
                  className="-me-1 ms-2 opacity-60 group-hover:opacity-100 group-hover:text-primary transition-transform group-hover:translate-x-0.5 group-hover:translate-y-[-0.125rem]"
                  size={14}
                  aria-hidden="true"
                />
              </Link>
            </Button>
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
                    partners with Oregon State Athletics, ensuring our athletic
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
                    We provide genuine, hands-on opportunities for Oregon State
                    University students to gain real-world experience developing
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
