"use client";

export const HeroVideo = () => {
  return (
    <div className="absolute inset-0 w-full h-screen">
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
        }}
      >
        <iframe
          src="https://customer-rm55c0smfzs9z1c2.cloudflarestream.com/b9730e9225ec7fd7700877bd954ae560/iframe?controls=false&autoplay=true&muted=true&loop=true"
          loading="lazy"
          style={{
            border: "none",
            position: "absolute",
            top: "50%",
            left: "50%",
            height: "56.25vw",
            width: "100vw",
            transform: "translate(-50%, -50%)",
            minHeight: "100vh",
            minWidth: "177.78vh",
          }}
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
          allowFullScreen={true}
        />
      </div>

      {/* Your noise overlay */}
      <div
        className="absolute inset-0 bg-black/5 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.10'/%3E%3C/svg%3E")`,
          mixBlendMode: "overlay",
        }}
      />
    </div>
  );
};
