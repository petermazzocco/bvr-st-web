"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Cookies from "js-cookie";
import Image from "next/image";

interface PageTransitionContextProps {
  children: React.ReactNode;
}

const LogoDisplay: React.FC<{
  onComplete: () => void;
}> = ({ onComplete }) => {
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

export const PageTransitionContext: React.FC<PageTransitionContextProps> = ({
  children,
}) => {
  const [showContent, setShowContent] = useState<boolean>(false);
  const [showLogo, setShowLogo] = useState<boolean>(false);

  // Cookie management
  const COOKIE_NAME = "bvr-st-co-logo-seen";

  const hasSeenLogo = (): boolean => {
    return Cookies.get(COOKIE_NAME) === "true";
  };

  const markLogoAsSeen = (): void => {
    Cookies.set(COOKIE_NAME, "true", { expires: 365 }); // expires in 1 year
  };

  useEffect(() => {
    // Check if user has seen logo animation
    if (hasSeenLogo()) {
      // Skip animation, show content immediately
      setShowContent(true);
      setShowLogo(false);
    } else {
      // First visit - show logo animation
      setShowLogo(true);
      setShowContent(false);
    }
  }, []);

  const handleLogoComplete = (): void => {
    markLogoAsSeen();
    setShowLogo(false);
    setShowContent(true);
  };

  // Show logo animation on first visit only
  if (showLogo) {
    return (
      <>
        <LogoDisplay onComplete={handleLogoComplete} />
        {/* Render children but hidden until logo completes */}
        <div style={{ visibility: "hidden" }}>{children}</div>
      </>
    );
  }

  // Show content (either after animation or immediately if cookie exists)
  if (showContent) {
    return <>{children}</>;
  }

  // Default: just render children
  return <>{children}</>;
};
