"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Cookies from "js-cookie";
import { usePathname } from "next/navigation";
import { Terminal, AnimatedSpan } from "@/components/ui/terminal";
import Image from "next/image";

interface TerminalWrapperProps {
  children: React.ReactNode;
  packageName?: string;
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

const LogoDisplay: React.FC<{
  packageName: string;
  onComplete: () => void;
}> = ({ packageName, onComplete }) => {
  const logoRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const gridLinesRef = useRef<HTMLDivElement>(null);
  const plusIconsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Prevent body scroll during logo display
    document.body.style.overflow = "hidden";

    const tl = gsap.timeline();

    // Initial setup - match terminal display setup
    if (logoRef.current) {
      gsap.set(logoRef.current, { opacity: 0, scale: 0.8 });
    }

    // Hide grid and plus icons initially, positioned below screen (same as terminal)
    if (gridLinesRef.current) {
      gsap.set(gridLinesRef.current, { y: "100vh", opacity: 0 });
    }
    if (plusIconsRef.current) {
      gsap.set(plusIconsRef.current, { y: "100vh", opacity: 0 });
    }

    // Logo appears with same animation as terminal
    if (logoRef.current) {
      tl.to(logoRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.3,
        ease: "back.out(1.7)",
      });
    }

    // Animate grid and plus icons sliding up
    tl.to(
      [gridLinesRef.current, plusIconsRef.current],
      {
        y: 0,
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
        stagger: 0.05,
      },
      0.4,
    );

    // Hold for shorter time
    tl.to({}, { duration: 0.4 });

    // Exit animation - slide background and logo up
    tl.to([backgroundRef.current, logoRef.current], {
      y: "-100vh",
      duration: 0.4,
      ease: "power3.in",
      onComplete: () => {
        // Restore body scroll
        document.body.style.overflow = "";
        onComplete();
      },
    });

    return () => {
      tl.kill();
      // Restore body scroll on cleanup
      document.body.style.overflow = "";
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Background that will slide up */}
      <div
        ref={backgroundRef}
        className="absolute inset-0 bg-muted-foreground backdrop-blur-sm"
      />

      {/* Grid Lines Overlay */}
      <div
        ref={gridLinesRef}
        className="absolute inset-0 pointer-events-none opacity-0 translate-y-full hidden md:block"
      >
        <div className="absolute left-1/4 top-0 bottom-0 w-[1px] bg-white/30"></div>
        <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-white/30"></div>
        <div className="absolute left-3/4 top-0 bottom-0 w-[1px] bg-white/30"></div>
      </div>

      {/* Plus Icons */}
      <div
        ref={plusIconsRef}
        className="absolute inset-0 pointer-events-none text-white opacity-0 translate-y-full"
      >
        {/* Top Row */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 text-xl sm:text-2xl lg:text-3xl font-thin">
          +
        </div>
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 sm:top-6 text-xl sm:text-2xl lg:text-3xl font-thin">
          +
        </div>
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 text-xl sm:text-2xl lg:text-3xl font-thin">
          +
        </div>

        {/* Bottom Row */}
        <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 text-xl sm:text-2xl lg:text-3xl font-thin">
          +
        </div>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 sm:bottom-6 text-xl sm:text-2xl lg:text-3xl font-thin">
          +
        </div>
        <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 text-xl sm:text-2xl lg:text-3xl font-thin">
          +
        </div>
      </div>

      {/* Logo container */}
      <div
        ref={logoRef}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Image
          src="/assets/icons/BEAVER-ST-CO_ICON-03.svg"
          alt="Logo"
          width={100}
          height={100}
        />
      </div>
    </div>
  );
};

const TerminalWrapper: React.FC<TerminalWrapperProps> = ({
  children,
  packageName = "bvr-st-co",
}) => {
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const gridLinesRef = useRef<HTMLDivElement>(null);
  const plusIconsRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const [showContent, setShowContent] = useState<boolean>(false);
  const [showTerminal, setShowTerminal] = useState<boolean>(false);
  const [showLogo, setShowLogo] = useState<boolean>(false);

  // Cookie management
  const COOKIE_NAME = "bvr-st-co-terminal-seen";

  const hasSeenTerminal = (): boolean => {
    return Cookies.get(COOKIE_NAME) === "true";
  };

  const markTerminalAsSeen = (): void => {
    Cookies.set(COOKIE_NAME, "true", { expires: 1 }); // expires in 1 day
  };

  const printConsoleMessage = (): void => {
    console.log(`
      ▄ ▖▖▄▖  ▄▖▄▖  ▄▖▄▖
      ▙▘▌▌▙▘  ▚ ▐   ▌ ▌▌
      ▙▘▚▘▌▌  ▄▌▐   ▙▖▙▌

      🎉 INSTALLATION COMPLETE!
      👀 You found our easter egg!
      🎁 Enjoy 50% OFF: BEAVERHACKER50
      🔥 Valid for all products! 💻 Keep being awesome!
      - The BVR ST CO Team

      P.S. Follow us on socials for updates! 🚀
    `);
  };

  const exitAnimation = (): void => {
    const tl = gsap.timeline();

    // Only slide up the background and terminal, leave grid/plus icons in place
    if (backgroundRef.current && terminalRef.current) {
      tl.to([backgroundRef.current, terminalRef.current], {
        y: "-100vh",
        duration: 0.8,
        ease: "power3.in",
        onComplete: () => {
          setShowContent(true);
        },
      });
    }
  };

  useEffect(() => {
    // Reset state on route change
    setShowContent(false);

    // Check if user has seen terminal in last 24 hours and set initial state
    if (hasSeenTerminal()) {
      setShowTerminal(false);
      setShowLogo(true);
    } else {
      setShowTerminal(true);
      setShowLogo(false);
    }
  }, [pathname]);

  useEffect(() => {
    if (!showTerminal) return;

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
    );

    // Print console message and mark terminal as seen after the final message appears
    tl.call(
      () => {
        printConsoleMessage();
        markTerminalAsSeen();
      },
      undefined,
      4.2,
    );

    // Start exit animation after all terminal content is done
    const totalDuration = 5000;
    tl.call(
      () => {
        exitAnimation();
      },
      undefined,
      totalDuration / 1000,
    );

    return () => {
      tl.kill();
    };
  }, [packageName, showTerminal]);

  const handleLogoComplete = (): void => {
    setShowLogo(false);
    setShowContent(true);
  };

  // Show logo if user has seen terminal before
  if (showLogo) {
    return (
      <>
        <LogoDisplay
          packageName={packageName}
          onComplete={handleLogoComplete}
        />
        {/* Render children but hidden until logo completes */}
        <div style={{ visibility: "hidden" }}>{children}</div>
      </>
    );
  }

  // Show content after animations complete
  if (showContent) {
    return <>{children}</>;
  }

  // Show terminal for first-time visitors
  if (showTerminal) {
    return (
      <>
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
            <div className="absolute left-1/4 top-0 bottom-0 w-[1px] bg-white/30"></div>
            <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-white/30"></div>
            <div className="absolute left-3/4 top-0 bottom-0 w-[1px] bg-white/30"></div>
          </div>

          {/* Plus Icons - stays in place */}
          <div
            ref={plusIconsRef}
            className="absolute inset-0 z-20 pointer-events-none text-white opacity-0 translate-y-full"
          >
            {/* Top Row */}
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 text-xl sm:text-2xl lg:text-3xl font-thin">
              +
            </div>
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 sm:top-6 text-xl sm:text-2xl lg:text-3xl font-thin">
              +
            </div>
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 text-xl sm:text-2xl lg:text-3xl font-thin">
              +
            </div>

            {/* Bottom Row */}
            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 text-xl sm:text-2xl lg:text-3xl font-thin">
              +
            </div>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 sm:bottom-6 text-xl sm:text-2xl lg:text-3xl font-thin">
              +
            </div>
            <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 text-xl sm:text-2xl lg:text-3xl font-thin">
              +
            </div>
          </div>

          {/* Terminal */}
          <div
            ref={terminalRef}
            className="min-w-[350px] max-w-[350px] sm:min-w-[425px] sm:max-w-[425px] z-30"
          >
            <Terminal>
              <AnimatedSpan delay={200}>
                $ brew install {packageName}
              </AnimatedSpan>
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

        {/* Render children but hidden until terminal completes */}
        <div style={{ visibility: "hidden" }}>{children}</div>
      </>
    );
  }

  // Default: just render children (shouldn't reach here)
  return <>{children}</>;
};

export default TerminalWrapper;
