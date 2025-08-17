"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const images = [
  "/assets/BEAVER-ST-CO_ABBRV-1-02.svg",
  "/assets/BEAVER-ST-CO_PRIMARY-05.svg",
];

export const HeroImage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => {
        let newIndex;
        do {
          newIndex = Math.floor(Math.random() * images.length);
        } while (newIndex === prevIndex && images.length > 1);
        return newIndex;
      });
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Image
      src={images[currentImageIndex]}
      alt="BVR ST CO."
      width={200}
      height={200}
      draggable={false}
    />
  );
};
