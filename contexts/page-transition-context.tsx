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
    } else {
      setShowContent(true);
    }
  }, [key, isHomePage]);

  if (isHomePage) {
    return <FrozenRouter>{children}</FrozenRouter>;
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
