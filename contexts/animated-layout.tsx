"use client";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode, useState, useEffect } from "react";
import Image from "next/image";

interface AnimatedLayoutProps {
  children: ReactNode;
}

export default function AnimatedLayout({ children }: AnimatedLayoutProps) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Small delay to ensure smooth transition start
    const timer = setTimeout(() => {
      setIsLoading(true);

      const duration = 1000;
      setTimeout(() => {
        setIsLoading(false);
      }, duration);
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          key={`loading-${pathname}`}
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{
            duration: 0.8,
            ease: "easeInOut",
            delay: 0.2,
          }}
        >
          {/* White background */}
          <div className="absolute inset-0 bg-white" />

          {/* Logo */}
          <motion.div
            className="relative z-10"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{
              duration: 0.3,
              delay: 0.2,
            }}
          >
            <Image
              src="/assets/icons/BEAVER-ST-CO_ICON-03.svg"
              alt="Logo"
              width={200}
              height={200}
              className="w-32 h-32 md:w-48 md:h-48 object-contain"
            />
          </motion.div>
        </motion.div>
      )}

      {!isLoading && (
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
