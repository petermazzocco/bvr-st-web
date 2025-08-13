"use client";

export const HeroVideo = () => {
  return (
    <>
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        disablePictureInPicture
        controlsList="nodownload nofullscreen noremoteplayback"
        onContextMenu={(e) => e.preventDefault()}
      >
        <source
          src="https://video.twimg.com/amplify_video/1953551064374161409/vid/avc1/1350x1080/4exec0o_lFWMaffn.mp4"
          type="video/mp4"
        />
        {/* Fallback for browsers that don't support video */}
        <div
          className="bg-foreground"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.60'/%3E%3C/svg%3E")`,
            mixBlendMode: "overlay",
          }}
        />
      </video>
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
