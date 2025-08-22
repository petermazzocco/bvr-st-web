import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import {
  Terminal,
  TypingAnimation,
  AnimatedSpan,
} from "@/components/ui/shadcn-io/terminal";

interface TerminalOverlayProps {
  packageName?: string;
  onComplete?: () => void;
}

const LoadingBar: React.FC<{ delay: number }> = ({ delay }) => {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => {
      setVisible(true);

      // Quick progress animation over 1.5 seconds
      const duration = 1000;
      const interval = 50;
      const steps = duration / interval;
      const increment = 100 / steps;

      let currentProgress = 0;
      const progressInterval = setInterval(() => {
        currentProgress += increment;
        if (currentProgress >= 100) {
          currentProgress = 100;
          clearInterval(progressInterval);
        }
        setProgress(Math.floor(currentProgress));
      }, interval);

      return () => clearInterval(progressInterval);
    }, delay);

    return () => clearTimeout(showTimer);
  }, [delay]);

  if (!visible) return null;

  // Calculate bars based on a fixed width (let's say 40 characters for full terminal width)
  const totalBars = 40;
  const filledBars = Math.floor((progress / 100) * totalBars);
  const emptyBars = totalBars - filledBars;

  return (
    <div className="text-md font-vt tracking-wider">
      <div>Installing... {progress}%</div>
      <div className="font-mono text-sm">
        <span className="text-green-400">{"█".repeat(filledBars)}</span>
        <span className="text-gray-500">{"░".repeat(emptyBars)}</span>
      </div>
    </div>
  );
};

const TerminalOverlay: React.FC<TerminalOverlayProps> = ({
  packageName = "bvr-st-co",
  onComplete,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const gridLinesRef = useRef<HTMLDivElement>(null);
  const plusIconsRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const [showMainContent, setShowMainContent] = useState<boolean>(false);

  useEffect(() => {
    const tl = gsap.timeline();

    // Initial setup
    if (overlayRef.current) {
      gsap.set(overlayRef.current, { opacity: 1 });
    }
    if (terminalRef.current) {
      gsap.set(terminalRef.current, { opacity: 0, scale: 0.8 });
    }
    // Hide grid and plus icons initially, positioned below screen
    if (gridLinesRef.current) {
      gsap.set(gridLinesRef.current, { y: "100vh", opacity: 0 });
    }
    if (plusIconsRef.current) {
      gsap.set(plusIconsRef.current, { y: "100vh", opacity: 0 });
    }

    // Terminal appears
    if (terminalRef.current) {
      tl.to(terminalRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: "back.out(1.7)",
      });
    }

    // Animate grid and plus icons sliding up when installation completes (at 2400ms)
    tl.call(
      () => {
        const slideUpTl = gsap.timeline();

        if (gridLinesRef.current && plusIconsRef.current) {
          slideUpTl.to([gridLinesRef.current, plusIconsRef.current], {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            stagger: 0.1,
          });
        }
      },
      undefined,
      2.4,
    ); // 2400ms delay

    // Start exit animation after all terminal content is done
    // Adjusted timing: 700ms delay + 1500ms loading + some buffer
    const totalDuration = 5000;
    tl.call(() => exitAnimation(), undefined, totalDuration / 1000);

    return () => {
      tl.kill();
    };
  }, [packageName]);

  const exitAnimation = (): void => {
    const tl = gsap.timeline();

    // Only slide up the background and terminal, leave grid/plus icons in place
    if (backgroundRef.current && terminalRef.current) {
      tl.to([backgroundRef.current, terminalRef.current], {
        y: "-100vh", // Slide up off screen
        duration: 0.8,
        ease: "power3.in",
        onComplete: () => {
          setShowMainContent(true);
          if (onComplete) {
            onComplete();
          }
        },
      });
    }
  };

  if (showMainContent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center relative">
        {/* Grid Lines Overlay */}
        <div className="absolute inset-0 z-0 pointer-events-none hidden md:block">
          {/* Three vertical lines */}
          <div className="absolute left-1/4 top-0 bottom-0 w-[1px] bg-foreground/5"></div>
          <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-foreground/5"></div>
          <div className="absolute left-3/4 top-0 bottom-0 w-[1px] bg-foreground/5"></div>
        </div>

        {/* Plus Icons */}
        <div className="absolute inset-0 z-0 pointer-events-none text-foreground/10">
          {/* Top Row */}
          <div className="absolute top-6 left-6 text-lg font-thin">+</div>
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 text-lg font-thin">
            +
          </div>
          <div className="absolute top-6 right-6 text-lg font-thin">+</div>

          {/* Bottom Row */}
          <div className="absolute bottom-6 left-6 text-lg font-thin">+</div>
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-lg font-thin">
            +
          </div>
          <div className="absolute bottom-6 right-6 text-lg font-thin">+</div>
        </div>

        <div className="text-center relative z-10">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Welcome to {packageName}!
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Installation completed successfully.
          </p>
          <div className="bg-card rounded-lg shadow-lg p-8 max-w-md mx-auto border border-border">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">
              Your App is Ready
            </h2>
            <p className="text-muted-foreground mb-6">
              The installation process has completed and your application is now
              ready to use.
            </p>
            <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
    >
      {/* Background that will slide up */}
      <div
        ref={backgroundRef}
        className="absolute inset-0 bg-muted-foreground backdrop-blur-sm z-10"
      />

      {/* Grid Lines Overlay - stays in place */}
      <div
        ref={gridLinesRef}
        className="absolute inset-0 z-20 pointer-events-none opacity-0 translate-y-full hidden md:block"
      >
        {/* Three vertical lines */}
        <div className="absolute left-1/4 top-0 bottom-0 w-[1px] bg-white/30"></div>
        <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-white/30"></div>
        <div className="absolute left-3/4 top-0 bottom-0 w-[1px] bg-white/30"></div>
      </div>

      {/* Plus Icons - stays in place */}
      <div
        ref={plusIconsRef}
        className="absolute inset-0 z-20 pointer-events-none text-white text-3xl opacity-0 translate-y-full"
      >
        {/* Top Row */}
        <div className="absolute top-6 left-6 text-3xl font-thin">+</div>
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 text-3xl font-thin">
          +
        </div>
        <div className="absolute top-6 right-6  text-3xl font-thin">+</div>

        {/* Bottom Row */}
        <div className="absolute bottom-6 left-6 text-3xl font-thin">+</div>
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-3xl font-thin">
          +
        </div>
        <div className="absolute bottom-6 right-6 text-3xl font-thin">+</div>
      </div>

      {/* Terminal */}
      <div ref={terminalRef} className="min-w-[425px] max-w-[425px] z-30">
        <Terminal className="max-w-none ">
          <AnimatedSpan delay={200}>$ brew install {packageName}</AnimatedSpan>

          <AnimatedSpan delay={400}>Downloading bvr-st-co</AnimatedSpan>

          <LoadingBar delay={700} />

          <AnimatedSpan delay={2000} className="text-secondary">
            ✓ Installation completed successfully!
          </AnimatedSpan>

          <AnimatedSpan delay={3000}>
            Printing a code to the console...
          </AnimatedSpan>
          <AnimatedSpan delay={4000} className="text-primary">
            Welcome to the future of Oregon State.
          </AnimatedSpan>
        </Terminal>
      </div>
    </div>
  );
};

export default TerminalOverlay;
