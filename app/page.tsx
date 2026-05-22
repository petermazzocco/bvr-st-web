"use client";

import { useEffect, useRef, useState } from "react";
import { GrainGradient } from "@paper-design/shaders-react";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const DISCORD_URL = "https://discord.gg/garbkjn5mJ";

const inceptionBenefits = [
  {
    n: "01",
    title: "Enterprise GPU Access",
    body: "On-demand access to high-powered NVIDIA GPUs through their cloud and on-campus at the Huang Complex Center — the same infrastructure powering frontier AI.",
  },
  {
    n: "02",
    title: "Technical Co-Development",
    body: "Direct guidance from NVIDIA's developer programs lets us build Scout on the Nemotron model family with production-grade tooling and support.",
  },
  {
    n: "03",
    title: "A Bridge to Beaver Nation",
    body: "Inception positions BVR ST STUDIO as the conduit between world-class technology partners and Oregon State Athletics, students, and student-athletes.",
  },
];

const pillars = [
  {
    n: "01",
    title: "Strategic Partnerships",
    body: "By aligning with NVIDIA through the Inception Program, we bridge world-class technology partners with Oregon State Athletics — ensuring our programs have access to industry-leading innovation.",
    tags: "Industry Collaboration · Technology Integration",
  },
  {
    n: "02",
    title: "Student Development",
    body: "We provide genuine, hands-on opportunities for Oregon State students to build real products and services that push athletics further. Students don't just learn — they ship.",
    tags: "Real-World Experience · Product Development",
  },
  {
    n: "03",
    title: "Scalable Innovation",
    body: "When we create successful products internally, we commercialize proven solutions and offer them to other universities and athletic programs — generating revenue while advancing the field.",
    tags: "Commercialization · Industry Impact",
  },
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-primary text-xs font-bold tracking-[0.25em] uppercase font-mono">
      {children}
    </p>
  );
}

export default function Page() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;

    const observer = new ResizeObserver(() => {
      setDimensions({ width: el.offsetWidth, height: el.offsetHeight });
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <main className="bg-background text-foreground">
      <div className="mx-auto w-full max-w-6xl border-x border-border">
        {/* Hero */}
        <section
          ref={heroRef}
          className="sticky top-0 z-0 flex h-[80vh] sm:h-[70vh] flex-col justify-center overflow-hidden border-b border-border px-6"
        >
          {dimensions.width > 0 && (
            <div className="absolute inset-0">
              <GrainGradient
                width={dimensions.width}
                height={dimensions.height}
                colors={["#c6750c", "#cd5d37"]}
                colorBack="#000a0f"
                softness={0.75}
                intensity={0.64}
                noise={0.5}
                shape="wave"
                speed={0.72}
                scale={2.2}
                offsetX={-1}
                offsetY={0.24}
              />
            </div>
          )}

          <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col-reverse items-center gap-8 md:flex-row md:items-center md:justify-between md:gap-10">
            <div className="text-center md:text-left">
              <div className="mb-2 flex items-center justify-center font-mono text-xs font-bold uppercase tracking-[0.25em] text-primary md:justify-start">
                Introducing
              </div>

              <h1 className="mb-6 text-[4rem] font-thin leading-[0.85] tracking-[-0.02em] text-white sm:text-[5rem] lg:text-[6.5rem]">
                THE SCOUT
                <br />
                PROGRAM
              </h1>

              <div className="flex flex-col items-center gap-3 sm:flex-row md:items-start">
                <Button
                  asChild
                  className="group h-12 bg-primary px-8 text-white hover:bg-primary/90"
                >
                  <Link
                    href="/scout"
                    data-umami-event="Scout Program apply clicked"
                    className="flex items-center justify-center text-xs uppercase tracking-[0.15em]"
                  >
                    <span>Learn More / Get Involved</span>
                    <ArrowUpRight
                      className="ms-2 opacity-70 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                      size={14}
                      aria-hidden="true"
                    />
                  </Link>
                </Button>
              </div>
            </div>

            <Image
              src="/assets/scout-on-white.svg"
              alt="Scout"
              width={200}
              height={2}
              priority
              className="h-20 w-20 shrink-0 rounded-2xl shadow-lg sm:h-44 sm:w-44"
            />
          </div>
        </section>

        <div className="relative z-20 bg-background">
          {/* NVIDIA Inception highlight */}
          <section className="border-b border-border px-6 py-12 md:px-12 md:py-16">
            <div className="mb-12 flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
              <div className="max-w-2xl">
                <Eyebrow>NVIDIA Inception Program</Eyebrow>
                <h2 className="mt-4 text-3xl font-thin tracking-[-0.02em] text-foreground md:text-5xl">
                  Backed by NVIDIA, end to end
                </h2>
                <p className="mt-5 font-light leading-relaxed text-muted-foreground">
                  BVR ST STUDIO is a proud member of the NVIDIA Inception
                  Program. It means our work is built with NVIDIA&apos;s own
                  infrastructure — giving Oregon State a real seat at the
                  frontier of sports AI.
                </p>
                <Link
                  href={"https://www.nvidia.com/en-us/startups"}
                  target="_blank"
                  data-umami-event="NVIDIA Inception learn more clicked"
                  className="mt-4 inline-flex items-center text-sm font-medium text-primary hover:text-primary/80"
                >
                  Learn more about the NVIDIA Inception Program
                  <ArrowUpRight className="ms-1" size={16} aria-hidden="true" />
                </Link>
              </div>

              <Image
                src="/nvidia.webp"
                alt="NVIDIA Inception Program"
                width={600}
                height={200}
                className="w-full max-w-xs shrink-0 opacity-90 md:max-w-sm"
              />
            </div>

            <div className="grid border-t border-border md:grid-cols-3">
              {inceptionBenefits.map((b, i) => (
                <div
                  key={b.n}
                  className={`px-0 py-8 md:px-8 md:py-10 ${
                    i !== 0
                      ? "border-t border-border md:border-l md:border-t-0"
                      : ""
                  }`}
                >
                  <span className="font-mono text-sm font-bold text-primary">
                    {b.n}
                  </span>
                  <h3 className="mt-3 text-lg font-medium text-foreground">
                    {b.title}
                  </h3>
                  <p className="mt-2 text-sm font-light leading-relaxed text-muted-foreground">
                    {b.body}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Discord CTA */}
          <section className="relative overflow-hidden border-b border-border px-6 py-24 md:px-12">
            <div className="grid-texture pointer-events-none absolute inset-0 opacity-60" />
            <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center text-center">
              <Image
                src="/discord.svg"
                alt="Discord"
                width={56}
                height={56}
                className="mb-6 h-12 w-12"
              />
              <Eyebrow>Join the Community</Eyebrow>
              <h2 className="mt-2 text-3xl font-thin tracking-[-0.02em] text-foreground md:text-5xl">
                Get involved today
              </h2>
              <p className="mt-3 font-light leading-relaxed text-muted-foreground">
                Whether you&apos;re a builder, an athlete, or part of Beaver
                Nation connect with the team, follow development in real time,
                and find your place at BVR ST STUDIO
              </p>
              <Button
                asChild
                className="group mt-10 h-12 bg-primary px-8 text-white hover:bg-primary/90"
              >
                <Link
                  href={DISCORD_URL}
                  target="_blank"
                  data-umami-event="Discord join clicked"
                  className="flex items-center justify-center text-xs uppercase tracking-[0.15em]"
                >
                  <span>Join the BVR ST STUDIO Discord</span>
                  <ArrowUpRight
                    className="ms-2 opacity-70 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                    size={14}
                    aria-hidden="true"
                  />
                </Link>
              </Button>
            </div>
          </section>

          {/* Who we are */}
          <section className="px-6 py-20 md:px-12 md:py-28">
            <div className="mb-12 max-w-2xl">
              <Eyebrow>Who We Are</Eyebrow>
              <h2 className="mt-4 text-3xl font-thin tracking-[-0.02em] text-foreground md:text-5xl">
                Studio operational overview
              </h2>
            </div>

            <div className="grid border border-border md:grid-cols-3">
              {pillars.map((p, i) => (
                <div
                  key={p.n}
                  className={`group flex flex-col p-8 transition-colors hover:bg-secondary md:p-10 ${
                    i !== 0
                      ? "border-t border-border md:border-l md:border-t-0"
                      : ""
                  }`}
                >
                  <span className="font-mono text-sm font-bold text-primary">
                    {p.n}
                  </span>
                  <h3 className="mt-4 text-xl font-medium uppercase tracking-wide text-foreground">
                    {p.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm font-light leading-relaxed text-muted-foreground">
                    {p.body}
                  </p>
                  <p className="mt-6 font-mono text-xs uppercase tracking-wide text-muted-foreground/70">
                    {p.tags}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
