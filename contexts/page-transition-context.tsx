"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { LayoutRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useContext, useRef, useState, useEffect } from "react";
import Image from "next/image";

function FrozenRouter(props: { children: React.ReactNode }) {
  const context = useContext(LayoutRouterContext ?? {});
  const frozen = useRef(context).current;

  if (!frozen) {
    return <>{props.children}</>;
  }

  return (
    <LayoutRouterContext.Provider value={frozen}>
      {props.children}
    </LayoutRouterContext.Provider>
  );
}

const variants = {
  hidden: { opacity: 0 },
  enter: { opacity: 1 },
  exit: { opacity: 0 },
};

const logoVariants = {
  hidden: { opacity: 0, y: 100 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, scale: 0 },
};

const overlayVariants = {
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const counterVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -100 },
};

const logoAssets = [
  "/assets/BEAVER-ST-CO_ABBRV-1-01.svg",
  "/assets/BEAVER-ST-CO_ABBRV-1-02.svg",
  "/assets/BEAVER-ST-CO_ABBRV-1-03.svg",
  "/assets/BEAVER-ST-CO_ABBRV-1-04.svg",
  "/assets/BEAVER-ST-CO_ABBRV-1-05.svg",
];

const PageTransitionContext = ({ children }: { children: React.ReactNode }) => {
  const key = usePathname();
  const isHomePage = key === "/";
  const [showLogo, setShowLogo] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [showCounter, setShowCounter] = useState(false);
  const [counter, setCounter] = useState(0);
  const [hasShownCounter, setHasShownCounter] = useState(false);

  useEffect(() => {
    if (!isHomePage) {
      setShowContent(false);
      setShowOverlay(true);
      setShowLogo(true);

      const logoTimer = setTimeout(() => {
        setShowLogo(false);
      }, 1500);

      const overlayTimer = setTimeout(() => {
        setShowOverlay(false);
        setShowContent(true);
      }, 2000);

      return () => {
        clearTimeout(logoTimer);
        clearTimeout(overlayTimer);
      };
    } else if (!hasShownCounter) {
      setHasShownCounter(true);
      setShowCounter(true);
      setShowContent(false);

      let currentCount = 0;
      const totalDuration = 3000;
      const targetCount = 100;

      const startTime = Date.now();

      const updateCounter = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / totalDuration, 1);

        const easeOutQuad = 1 - (1 - progress) * (1 - progress);
        currentCount = Math.floor(easeOutQuad * targetCount);

        setCounter(currentCount);

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          setCounter(100);
          setTimeout(() => {
            setShowCounter(false);
            setTimeout(() => {
              setShowContent(true);
            }, 500);
          }, 300);
        }
      };

      requestAnimationFrame(updateCounter);
    } else {
      setShowContent(true);
    }
  }, [key, isHomePage, hasShownCounter]);

  if (isHomePage) {
    return (
      <>
        <AnimatePresence>
          {showCounter && (
            <motion.div
              className="fixed inset-0 z-50 bg-white flex items-center justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { duration: 0.3, ease: "easeOut" },
              }}
              exit={{
                opacity: 0,
                y: -100,
                transition: { duration: 0.5, ease: "easeInOut" },
              }}
            >
              <div className="text-8xl font-bold text-black tabular-nums">
                {counter}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showContent && (
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <FrozenRouter>{children}</FrozenRouter>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <>
      <AnimatePresence>
        {showOverlay && (
          <motion.div
            className="fixed inset-0 z-40 bg-background"
            initial="visible"
            animate="visible"
            exit="exit"
            variants={overlayVariants}
            transition={{ ease: "easeInOut", duration: 0.5 }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLogo && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial="hidden"
            animate="visible"
            exit={{
              opacity: 0,
              x: [0, 5, -5, 2, -2, 0],
              y: [0, -2, 2, -1, 1, 0],
              transition: { duration: 0.2, ease: "linear" },
            }}
            variants={logoVariants}
            transition={{ ease: "easeInOut", duration: 0.5 }}
          >
            <Image
              src="/assets/BEAVER-ST-CO_ABBRV-1-01.svg"
              alt="BVR ST CO"
              width={400}
              height={300}
              className="object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="popLayout">
        {showContent && (
          <motion.div
            key={key}
            initial="hidden"
            animate="enter"
            exit="exit"
            variants={variants}
            transition={{ ease: "easeInOut", duration: 0.4 }}
          >
            <FrozenRouter>{children}</FrozenRouter>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PageTransitionContext;
