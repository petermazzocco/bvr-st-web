"use client";

import { useState } from "react";

export const HeroVideo = () => {
  const [videoError, setVideoError] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  return (
    <>
      {!videoError && (
        <video
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            videoLoaded ? "opacity-100" : "opacity-0"
          }`}
          autoPlay
          muted
          loop
          playsInline
          disablePictureInPicture
          controlsList="nodownload nofullscreen noremoteplayback"
          onContextMenu={(e) => e.preventDefault()}
          onError={() => setVideoError(true)}
          onLoadedData={() => setVideoLoaded(true)}
        >
          <source src="/videos/main.mp4" type="video/mp4" />
        </video>
      )}

      {(videoError || !videoLoaded) && (
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url("/main-fallback.png")`,
          }}
        />
      )}

      <div
        className="absolute inset-0 bg-black/20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.10'/%3E%3C/svg%3E")`,
          mixBlendMode: "overlay",
        }}
      ></div>
    </>
  );
};
